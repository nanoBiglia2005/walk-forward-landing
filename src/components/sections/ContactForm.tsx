"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { requestTraceRefresh } from "@/components/trace/TraceLayer";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { contact } from "@/content/site";
import { sendInquiry, type Inquiry } from "@/lib/inquiry";

const form = contact.form;

type Required = "name" | "email" | "message";
type Errors = Partial<Record<Required, string>>;

const empty: Inquiry = { name: "", email: "", country: "", city: "", source: "", sector: form.sector.options[0], message: "" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Inquiry): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = form.name.error;
  if (!EMAIL.test(values.email.trim())) errors.email = form.email.error;
  if (!values.message.trim()) errors.message = form.message.error;
  return errors;
}

// v2/Field: 2px black border; focus and error thicken it to 3px (Navy/700, Red/700) in 200ms.
const control = [
  "w-full border-2 border-black bg-white px-4 py-[14px] type-body text-black outline-hidden placeholder:text-gray-500",
  "transition-[border-color,box-shadow] duration-200 ease-io",
  "focus:border-navy-700 focus:shadow-[inset_0_0_0_1px_var(--color-navy-700)]",
  "aria-invalid:border-red-700 aria-invalid:shadow-[inset_0_0_0_1px_var(--color-red-700)]",
].join(" ");

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-strong-sm">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="type-strong-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Inquiry>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLParagraphElement>(null);

  // The circuit ends at the form action: re-measure when errors or the confirmation move it.
  useEffect(() => {
    requestTraceRefresh();
    if (status === "sent") thanksRef.current?.focus();
  }, [errors, status]);

  const set = (key: keyof Inquiry) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (key in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key as Required];
        return next;
      });
    }
  };

  const describedBy = (key: Required) => (errors[key] ? `contacto-${key}-error` : undefined);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    const first = (Object.keys(next) as Required[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#contacto-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    await sendInquiry(values);
    setStatus("sent");
  };

  const reset = () => {
    setValues(empty);
    setAccepted(false);
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div className="rise flex flex-col items-start gap-8" style={{ "--rise": "8px", animationDuration: "300ms" } as CSSProperties}>
        <p ref={thanksRef} tabIndex={-1} role="status" className="type-heading outline-none lg:type-title">
          {form.success}
        </p>
        <Button variant="outline-ink" data-a="submit" onClick={reset} className="w-full lg:w-auto">
          {form.again}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-4">
        <Field id="contacto-name" label={form.name.label} error={errors.name}>
          <input
            id="contacto-name"
            name="name"
            autoComplete="name"
            placeholder={form.name.placeholder}
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={describedBy("name")}
            className={control}
          />
        </Field>
        <Field id="contacto-email" label={form.email.label} error={errors.email}>
          <input
            id="contacto-email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder={form.email.placeholder}
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={describedBy("email")}
            className={control}
          />
        </Field>
        <Field id="contacto-country" label={form.country.label}>
          <input
            id="contacto-country"
            name="country"
            autoComplete="country-name"
            placeholder={form.country.placeholder}
            value={values.country}
            onChange={set("country")}
            className={control}
          />
        </Field>
        <Field id="contacto-city" label={form.city.label}>
          <input
            id="contacto-city"
            name="city"
            autoComplete="address-level2"
            placeholder={form.city.placeholder}
            value={values.city}
            onChange={set("city")}
            className={control}
          />
        </Field>
      </div>

      <Field id="contacto-source" label={form.source.label}>
        <div className="relative">
          <select
            id="contacto-source"
            name="source"
            value={values.source}
            onChange={set("source")}
            className={`${control} cursor-pointer appearance-none pr-12 ${values.source ? "" : "text-gray-500"}`}
          >
            <option value="" disabled>
              {form.source.placeholder}
            </option>
            {form.source.options.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2" />
        </div>
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 type-strong-sm">{form.sector.label}</legend>
        <div className="flex gap-3">
          {form.sector.options.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="sector"
                value={option}
                checked={values.sector === option}
                onChange={set("sector")}
                className="peer sr-only sr-focus"
              />
              <span className="block border-2 border-black px-6 py-3 type-strong transition-colors duration-200 ease-io peer-checked:bg-black peer-checked:text-lime">
                {option}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="contacto-message" label={form.message.label} error={errors.message}>
        <textarea
          id="contacto-message"
          name="message"
          rows={4}
          placeholder={form.message.placeholder}
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={describedBy("message")}
          className={`${control} block h-32 min-h-32 resize-y`}
        />
      </Field>

      <p className="border-l-[3px] border-black pl-4 type-body-sm">{form.privacy}</p>

      <label className="flex cursor-pointer items-start gap-3 type-body">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="peer sr-only sr-focus"
        />
        <span
          aria-hidden="true"
          className="mt-px grid size-[22px] shrink-0 place-content-center border-2 border-black bg-white peer-checked:bg-black [&>svg]:invisible peer-checked:[&>svg]:visible"
        >
          <Icon name="check" className="size-4 text-lime" />
        </span>
        {form.accept}
      </label>

      <Button
        type="submit"
        data-a="submit"
        disabled={!accepted || status === "sending"}
        className="w-full lg:w-auto lg:self-start"
      >
        {status === "sending" ? form.sending : form.submit}
      </Button>
    </form>
  );
}
