import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { clinic, services } from '../clinic.config';

gsap.registerPlugin(ScrollTrigger);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const disposers: (() => void)[] = [];
let smoothScroll: Lenis | undefined;
const header = document.querySelector<HTMLElement>('[data-header]');
const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
const setMenu = (open: boolean) => {
  if (!menu || !mobileNav) return;
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  if (open) smoothScroll?.stop();
  else smoothScroll?.start();
  header?.classList.remove('is-hidden');
};
menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
const treatmentMenu = document.querySelector<HTMLDetailsElement>('.nav-disclosure');
document.addEventListener('pointerdown', (event) => {
  if (treatmentMenu?.open && !treatmentMenu.contains(event.target as Node))
    treatmentMenu.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && treatmentMenu?.open) {
    treatmentMenu.open = false;
    treatmentMenu.querySelector('summary')?.focus();
  }
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
  if (event.key === 'Tab' && mobileNav && !mobileNav.hidden) {
    const links = [...mobileNav.querySelectorAll<HTMLAnchorElement>('a')];
    if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault();
      menu?.focus();
    } else if (event.shiftKey && document.activeElement === menu) {
      event.preventDefault();
      links.at(-1)?.focus();
    }
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});
let lastScroll = window.scrollY;
window.addEventListener(
  'scroll',
  () => {
    const y = window.scrollY;
    if (menu?.getAttribute('aria-expanded') !== 'true' && !header?.contains(document.activeElement))
      header?.classList.toggle('is-hidden', y > lastScroll && y > 180);
    lastScroll = y;
  },
  { passive: true },
);
document
  .querySelectorAll<HTMLElement>('[data-comparison]')
  .forEach((comparison) =>
    comparison
      .querySelector('input')
      ?.addEventListener('input', (event) =>
        comparison.style.setProperty('--split', `${(event.target as HTMLInputElement).value}%`),
      ),
  );
document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
  gallery.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) =>
    button.addEventListener('click', () => {
      gallery
        .querySelectorAll('[data-filter]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      let count = 0;
      gallery.querySelectorAll<HTMLElement>('[data-category]').forEach((card) => {
        card.hidden =
          button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
      });
      const status = gallery.querySelector('[data-filter-status]');
      if (status)
        status.textContent = `Showing ${count} illustrated ${count === 1 ? 'smile' : 'smiles'}.`;
    }),
  );
});
// Native details remains usable with JavaScript disabled. Motion is a small enhancement.
document.querySelectorAll<HTMLDetailsElement>('.faq-item').forEach((details) => {
  const summary = details.querySelector('summary');
  let animation: Animation | null = null;
  summary?.addEventListener('click', (event) => {
    if (reduced.matches) return;
    event.preventDefault();
    animation?.cancel();
    const from = details.offsetHeight;
    const opening = !details.open;
    if (opening) details.open = true;
    const to = opening ? details.offsetHeight : summary.offsetHeight;
    details.style.overflow = 'hidden';
    animation = details.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
    animation.onfinish = () => {
      details.open = opening;
      details.style.overflow = '';
      animation = null;
    };
  });
});

function localNow() {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: clinic.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const part = (type: string) => p.find((item) => item.type === type)?.value || '';
  return {
    date: `${part('year')}-${part('month')}-${part('day')}`,
    day: part('weekday'),
    minutes: Number(part('hour')) * 60 + Number(part('minute')),
  };
}
function updateHours() {
  const badge = document.querySelector('[data-open-badge]'),
    text = document.querySelector('[data-open-text]');
  if (!badge || !text) return;
  const now = localNow(),
    hours = clinic.hours.find((day) => day.day === now.day);
  const minutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  const open = Boolean(
    hours?.open && now.minutes >= minutes(hours.open) && now.minutes < minutes(hours.close),
  );
  badge.classList.toggle('is-open', open);
  text.textContent = `${open ? 'Open now' : 'Closed now'} · ${clinic.timezone.split('/')[1].replace('_', ' ')} time`;
}
updateHours();
const hoursInterval = window.setInterval(updateHours, 60000);
disposers.push(() => clearInterval(hoursInterval));

const booking = document.querySelector<HTMLFormElement>('[data-booking]');
if (booking) {
  const fields = [...booking.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const next = booking.querySelector<HTMLButtonElement>('[data-next]')!,
    back = booking.querySelector<HTMLButtonElement>('[data-back]')!,
    confirm = booking.querySelector<HTMLButtonElement>('[data-confirm]')!,
    error = booking.querySelector<HTMLElement>('[data-error]')!,
    date = booking.querySelector<HTMLInputElement>('[name=date]')!,
    slots = booking.querySelector<HTMLElement>('[data-slots]')!;
  let step = 0;
  const now = localNow();
  date.min = now.date;
  const max = new Date(`${now.date}T12:00:00Z`);
  max.setUTCDate(max.getUTCDate() + 90);
  date.max = max.toISOString().slice(0, 10);
  const selectedService = new URLSearchParams(location.search).get('service');
  booking.querySelectorAll<HTMLInputElement>('[name=service]').forEach((input) => {
    if (input.value === selectedService) input.checked = true;
  });
  const values = () => new FormData(booking);
  const serviceName = (value: FormDataEntryValue | null) =>
    services.find((s) => s.slug === value)?.name || 'A first visit / check-up';
  const summary = (target: Element) => {
    const data = values();
    target.replaceChildren();
    for (const line of [
      `Your care: ${serviceName(data.get('service'))}`,
      `Your date: ${new Date(`${data.get('date')}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`,
      `Your time: ${data.get('time')} · ${clinic.timezone}`,
      `Your name: ${data.get('firstName')} ${data.get('lastName')}`,
      `Your email: ${data.get('email')}`,
    ]) {
      const p = document.createElement('p');
      p.textContent = line;
      target.append(p);
    }
  };
  const show = (index: number, focus = true) => {
    step = index;
    fields.forEach((field, i) => (field.hidden = i !== step));
    booking.querySelectorAll('.step-progress li').forEach((li, i) => {
      if (i === step) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    back.hidden = step === 0;
    next.hidden = step === 3;
    confirm.hidden = step !== 3;
    next.querySelector('span')!.textContent =
      ['Find a time', 'A little about you', 'Review your visit'][step] || 'Next';
    error.textContent = '';
    if (step === 3) summary(booking.querySelector('[data-review]')!);
    if (focus) {
      fields[step].tabIndex = -1;
      fields[step].focus({ preventScroll: true });
    }
  };
  const fail = (message: string, field?: HTMLElement) => {
    error.textContent = message;
    field?.focus();
    return false;
  };
  const validate = () => {
    if (step === 0 && !values().get('service'))
      return fail(
        'Choose a type of care to continue.',
        booking.querySelector('[name=service]') as HTMLElement,
      );
    if (step === 1) {
      if (!date.value || !date.validity.valid)
        return fail('Choose a date within the next 90 days.', date);
      if (!values().get('time'))
        return fail('Choose an available time to continue.', slots.querySelector('input') || date);
    }
    if (step === 2) {
      const controls = [
        ...fields[2].querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input,textarea'),
      ];
      for (const input of controls) {
        if (
          !input.validity.valid ||
          (input.required && input.type !== 'checkbox' && !input.value.trim())
        )
          return fail(
            input.type === 'checkbox'
              ? 'Please acknowledge that this is a demo.'
              : input.type === 'email'
                ? 'Enter a valid email address.'
                : `Please complete ${input.labels?.[0]?.textContent?.trim().toLowerCase() || 'this field'}.`,
            input,
          );
      }
      const phone = String(values().get('phone'));
      if (!/^[+()\d\s.-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7)
        return fail(
          'Enter a valid sample phone number.',
          booking.querySelector('[name=phone]') as HTMLElement,
        );
    }
    return true;
  };
  const renderSlots = () => {
    slots.replaceChildren();
    error.textContent = '';
    if (!date.value || !date.validity.valid) {
      slots.textContent = 'Choose a valid date to see times.';
      return;
    }
    const weekday = new Date(`${date.value}T12:00:00Z`).getUTCDay(),
      hours = clinic.hours[weekday];
    if (!hours.open) {
      slots.textContent = 'The studio is closed on this day. Please choose another date.';
      return;
    }
    const from = Number(hours.open.slice(0, 2)) * 60,
      to = Number(hours.close.slice(0, 2)) * 60,
      current = localNow();
    let count = 0;
    for (let minutes = from; minutes + 60 <= to; minutes += 60) {
      if (date.value === current.date && minutes <= current.minutes + 30) continue;
      const time = `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${minutes < 720 ? 'AM' : 'PM'}`;
      const label = document.createElement('label');
      label.className = 'choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'time';
      input.value = time;
      input.required = true;
      const span = document.createElement('span');
      span.textContent = time;
      label.append(input, span);
      slots.append(label);
      count++;
    }
    if (!count) slots.textContent = 'No demo times remain on this day. Try the next open day.';
  };
  date.addEventListener('change', renderSlots);
  next.addEventListener('click', () => {
    if (validate()) show(step + 1);
  });
  back.addEventListener('click', () => show(step - 1));
  booking.addEventListener('submit', (event) => {
    event.preventDefault();
    if (step !== 3) {
      if (validate()) show(step + 1);
      return;
    }
    summary(booking.querySelector('[data-final-summary]')!);
    fields.forEach((field) => (field.hidden = true));
    booking.querySelector<HTMLElement>('.step-progress')!.hidden = true;
    booking.querySelector<HTMLElement>('.form-actions')!.hidden = true;
    error.hidden = true;
    const complete = booking.querySelector<HTMLElement>('[data-confirmation]')!;
    complete.hidden = false;
    complete.focus();
    booking.reset();
  });
  booking.querySelector('[data-restart]')?.addEventListener('click', () => {
    booking.reset();
    slots.textContent = 'Choose a date first.';
    booking.querySelector<HTMLElement>('[data-confirmation]')!.hidden = true;
    booking.querySelector<HTMLElement>('.step-progress')!.hidden = false;
    booking.querySelector<HTMLElement>('.form-actions')!.hidden = false;
    error.hidden = false;
    show(0);
  });
  show(0, false);
}
const contact = document.querySelector<HTMLFormElement>('[data-contact-form]');
contact?.addEventListener('submit', (event) => {
  event.preventDefault();
  const error = contact.querySelector<HTMLElement>('[data-contact-error]')!;
  error.textContent = '';
  for (const input of contact.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input,textarea',
  )) {
    if (
      !input.validity.valid ||
      (input.required && input.type !== 'checkbox' && !input.value.trim()) ||
      (input.name === 'message' && input.value.trim().length < 10)
    ) {
      error.textContent =
        input.type === 'email'
          ? 'Enter a valid email address.'
          : input.type === 'checkbox'
            ? 'Please acknowledge that this is a demo.'
            : input.name === 'message'
              ? 'Write a sample message of at least 10 characters.'
              : 'Please enter your name.';
      input.focus();
      return;
    }
  }
  const success = contact.querySelector<HTMLElement>('[data-contact-success]')!;
  success.hidden = false;
  contact.querySelector<HTMLButtonElement>('button[type=submit]')!.hidden = true;
  contact.reset();
  success.focus();
});
contact?.querySelector('[data-contact-reset]')?.addEventListener('click', () => {
  contact.querySelector<HTMLElement>('[data-contact-success]')!.hidden = true;
  contact.querySelector<HTMLButtonElement>('button[type=submit]')!.hidden = false;
  contact.querySelector<HTMLInputElement>('input')?.focus();
});
// A submit control is enabled only after its local-only handler exists.
document
  .querySelectorAll<HTMLButtonElement>('[data-form-enable]')
  .forEach((button) => (button.disabled = false));

if (!reduced.matches) {
  const lenis = (smoothScroll = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.88,
    syncTouch: window.matchMedia('(pointer: coarse)').matches,
    syncTouchLerp: 0.1,
    touchInertiaExponent: 1.5,
    anchors: { offset: -104 },
    autoRaf: false,
    stopInertiaOnNavigate: true,
    prevent: (node) =>
      node instanceof HTMLElement &&
      (node.tagName === 'TEXTAREA' || Boolean(node.closest('[data-lenis-prevent]'))),
  }));
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  // Scroll, scroll-linked timelines and WebGL render on one ordered clock.
  gsap.ticker.add(tick, false, true);
  gsap.ticker.lagSmoothing(0);
  disposers.push(() => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    smoothScroll = undefined;
  });
  document.querySelectorAll<HTMLElement>('[data-headline]').forEach((heading) => {
    const groups: Node[][] = [[]];
    [...heading.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) return;
      if (node.nodeName === 'BR') groups.push([]);
      else if (node.nodeName === 'SPAN' && heading.children.length > 1) {
        if (groups.at(-1)!.length) groups.push([]);
        groups.at(-1)!.push(node);
        groups.push([]);
      } else groups.at(-1)!.push(node);
    });
    heading.replaceChildren();
    const lines: HTMLElement[] = [];
    groups
      .filter((group) => group.length)
      .forEach((group) => {
        const mask = document.createElement('span'),
          line = document.createElement('span');
        mask.className = 'line-mask';
        group.forEach((node) => line.append(node));
        mask.append(line);
        heading.append(mask);
        lines.push(line);
      });
    gsap.from(lines, {
      yPercent: 105,
      opacity: 0,
      duration: 0.85,
      stagger: 0.075,
      ease: 'power3.out',
      delay: 0.05,
    });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) =>
    gsap.from(element, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 93%', once: true },
    }),
  );
  document.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((element) => {
    const image = element.querySelector('img');
    if (image)
      gsap.from(image, {
        scale: 1.06,
        opacity: 0.7,
        duration: 0.9,
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      });
  });
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
    const end = Number(element.dataset.count),
      value = { number: 0 };
    gsap.to(value, {
      number: end,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      onUpdate: () =>
        (element.textContent =
          end % 1 ? value.number.toFixed(1) : Math.round(value.number).toLocaleString('en-US')),
    });
  });
  if (window.matchMedia('(pointer:fine)').matches)
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const bounds = button.getBoundingClientRect();
        gsap.to(button, {
          x: (event.clientX - bounds.left - bounds.width / 2) * 0.08,
          y: (event.clientY - bounds.top - bounds.height / 2) * 0.12,
          duration: 0.65,
          ease: 'power3.out',
        });
      });
      button.addEventListener('pointerleave', () =>
        gsap.to(button, { x: 0, y: 0, duration: 0.65, ease: 'power3.out' }),
      );
    });
  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lazyObserver.unobserve(entry.target);
          import('./scenes')
            .then(({ createScene }) => {
              if (!reduced.matches) disposers.push(createScene(entry.target as HTMLElement));
            })
            .catch(() => {
              /* The original SVG remains visible if WebGL cannot load. */
            });
        }
      });
    },
    { rootMargin: '160px' },
  );
  document.querySelectorAll('[data-scene]').forEach((element) => lazyObserver.observe(element));
  disposers.push(() => lazyObserver.disconnect());
}
// Stop GPU work if the visitor changes motion preference while this document is open.
reduced.addEventListener('change', () => {
  disposers.splice(0).forEach((dispose) => dispose());
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.globalTimeline.getChildren().forEach((animation) => animation.progress(1));
  document
    .querySelectorAll<HTMLElement>('[data-scene]')
    .forEach((scene) => scene.classList.remove('has-webgl'));
});
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) disposers.forEach((dispose) => dispose());
});
