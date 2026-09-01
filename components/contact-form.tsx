"use client";

import { useId, useState, type FormEvent } from "react";

import { projectStages, site } from "@/lib/content";

const fieldClass =
  "border-0 border-b border-field bg-transparent py-2.5 text-[16px] leading-[1.4] outline-none transition-colors focus:border-ink";

const labelClass =
  "mono-nav tracking-[0.14em] text-muted";

export function ContactForm() {
  const id = useId();
  const [sent, setSent] = useState(false);

  /**
   * No backend is wired up yet, so this only moves the form into its
   * confirmed state. The mailto fallback below stays available either way.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-[520px] flex-col gap-5"
      noValidate
    >
      <label htmlFor={`${id}-name`} className="flex flex-col gap-2">
        <span className={labelClass}>Name</span>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          className={fieldClass}
        />
      </label>

      <label htmlFor={`${id}-org`} className="flex flex-col gap-2">
        <span className={labelClass}>Organisation</span>
        <input
          id={`${id}-org`}
          name="organisation"
          type="text"
          autoComplete="organization"
          className={fieldClass}
        />
      </label>

      <label htmlFor={`${id}-email`} className="flex flex-col gap-2">
        <span className={labelClass}>Email</span>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </label>

      <label htmlFor={`${id}-stage`} className="flex flex-col gap-2">
        <span className={labelClass}>Project stage</span>
        <select
          id={`${id}-stage`}
          name="stage"
          defaultValue={projectStages[0]}
          className={fieldClass}
        >
          {projectStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor={`${id}-enquiry`} className="flex flex-col gap-2">
        <span className={labelClass}>Nature of enquiry</span>
        <textarea
          id={`${id}-enquiry`}
          name="enquiry"
          rows={4}
          required
          className={`${fieldClass} resize-y leading-[1.5]`}
        />
      </label>

      <button
        type="submit"
        className="mono-nav mt-2 self-start bg-ink px-[26px] py-4 tracking-[0.14em] text-paper transition-colors hover:bg-accent hover:text-white"
      >
        Submit enquiry
      </button>

      <p aria-live="polite" className="mono-caption leading-[1.7] text-muted">
        {sent ? (
          <>
            <span className="text-accent">
              This form is not yet connected to a mailbox.
            </span>{" "}
            Nothing has been sent. Please email{" "}
            <a
              href={`mailto:${site.email}`}
              className="border-b border-field text-ink [overflow-wrap:anywhere]"
            >
              {site.email}
            </a>{" "}
            directly and we will respond with an assessment of fit.
          </>
        ) : null}
      </p>
    </form>
  );
}
