"use client";
import DynamicIcon from "../utils/DynamicIcon";
import RichText from "../utils/RichText";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useTheme } from "../../context/theme/context";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

export default function ContactForm(props) {
  const form = props.data;
  const { themeColors } = useTheme();
  const links = props.links;
  const client = props.client || {};
  const domain = props.domain;
  const [submitting, setSubmitting] = useState(false);
  const [validForm, setValidForm] = useState(false);

  const [formData, setFormData] = useState({});

  const classes = props.classNames || {
    sectionBgColor: "bg-white",
    sectionPaddingY: "py-10",
    sectionPaddingX: "px-6",
    containerPaddingX: "px-6",
    containerPaddingY: "py-12",
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getLinkHref = (link, client) => {
    switch (link.data.destination) {
      case "phone":
        return `tel:${client.twilioPhoneNumber || client.businessPhoneNumber}`;

      case "email":
        return `mailto:${client.email}`;

      case "sms":
        return `sms:${client.twilioPhoneNumber || client.businessPhoneNumber}`;

      case "external":
        return link.data.href || "#";

      default:
        return link.data.href || "#";
    }
  };

  const actionHandler = (action, payload) => {
    switch (action) {
      case "chat": {
        openChat();
        sendMessage(
          { text: payload.message },
          {
            body: {
              domain: window.location.hostname,
              sessionId: sessionId,
            },
          },
        );
        break;
      }
      case "form-submit": {
        setSubmitting(true);
        const formSubmit = handleSubmit();
        setTimeout(() => {
          setSubmitting(false);
        }, 1000);
      }
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    // Submit Form

    const formSubmitReq = await fetch("/api/form-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: domain,
        formSubmissionData: formData,
      }),
    });
  };

  const validateForm = () => {
    const errors = {};

    form.forEach((field) => {
      const value = formData[field.id];

      // Required field validation
      if (field.required && (!value || value.toString().trim() === "")) {
        errors[field.id] = `${field.label} is required.`;
        return;
      }

      // Don't validate format if optional field is empty
      if (!value || value.toString().trim() === "") {
        return;
      }

      // Email validation
      if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) {
          errors[field.id] = "Please enter a valid email address.";
        }
      }

      // Phone validation
      if (field.type === "phone" || field.type === "tel") {
        const phoneDigits = value.replace(/\D/g, "");

        if (phoneDigits.length < 10) {
          errors[field.id] = "Please enter a valid phone number.";
        }
      }
    });
    if (errors) {
      setValidForm(false);
      return errors;
    }
    setValidForm(true);
  };

  const renderField = (field) => {
    const commonInputClasses =
      "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    switch (field.type) {
      case "input":
        return (
          <input
            id={field.id}
            name={field.name}
            type={field.inputType || "text"}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonInputClasses}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows || 5}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${commonInputClasses} resize-y`}
          />
        );

      case "dropdown":
        return (
          <select
            id={field.id}
            name={field.name}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonInputClasses}
          >
            <option value="">{field.placeholder || "Select an option"}</option>

            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };
  console.log("Classes", classes);
  return (
    <section
      className={`relative ${classes.sectionPaddingY} ${classes.sectionPaddingX} ${classes.sectionBgColor}  `}
    >
      {submitting ? (
        <div
          className={twMerge(
            "mx-auto w-full md:w-[80%] lg:w-[70%]",
            classes.containerPaddingX,
            classes.containerPaddingY,
            classes.custom,
          )}
        >
          <div className=" loader flex justify-center items-center h-full">
            <Oval
              height={400}
              width={400}
              color="#000000"
              secondaryColor="#000000"
              ariaLabel="oval-loading"
            />
          </div>
        </div>
      ) : (
        <div
          className={twMerge(
            "mx-auto w-full md:w-[80%] lg:w-[70%]",
            classes.containerPaddingX,
            classes.containerPaddingY,
            classes.custom,
          )}
        >
          <form onSubmit={handleSubmit} className="">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {form.map((field) => (
                <div
                  key={field.id}
                  className={
                    field.size === "half" ? "md:col-span-1" : "md:col-span-2"
                  }
                >
                  <label
                    htmlFor={field.id}
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    {field.label}

                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>

                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* <button
            type="submit"
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {form.submitText || "Submit"}
          </button> */}

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {links.map((link, index) => {
                if (link.data.type === "action") {
                  return (
                    <button
                      type="button"
                      key={index}
                      className={twMerge(
                        `${themeColors["primaryButtonText"]}
   ${themeColors["primaryButtonBg"]}
   ${themeColors["primaryButtonHoverShadow"]}
   transition-all px-5 py-2 rounded-full cursor-pointer`,
                        link.classNames?.custom,
                      )} // onClick={() => actionHandler(link.data.action)}
                      onClick={() =>
                        actionHandler(link.data.action, link.payload)
                      }
                    >
                      {/* Left Icon */}
                      {link.data.icon && link.data.iconPosition === "left" && (
                        <span className="mr-2">
                          <DynamicIcon
                            iconName={link.data.icon.name}
                            classNames={link.data.icon.classNames}
                            size={link.data.icon.size || 20}
                          />
                        </span>
                      )}
                      {link.data.label}
                      {/* Right Icon */}
                      {link.data.icon && link.data.iconPosition === "right" && (
                        <span className="ml-2">
                          <DynamicIcon
                            iconName={link.data.icon.name}
                            classNames={link.data.icon.classNames}
                            size={link.data.icon.size || 20}
                          />
                        </span>
                      )}
                    </button>
                  );
                } else if (link.data.type === "link") {
                  return (
                    <a
                      key={index}
                      href={getLinkHref(link, client)}
                      className={twMerge(
                        `${themeColors["primaryButtonText"]}
   ${themeColors["primaryButtonBg"]}
   ${themeColors["primaryButtonHoverShadow"]}
   transition-all px-5 py-2 rounded-full cursor-pointer`,
                        link.classNames?.custom,
                      )}
                    >
                      {/* Left Icon */}
                      {link.data.icon && link.data.iconPosition === "left" && (
                        <span className="mr-2">
                          <DynamicIcon
                            iconName={link.data.icon.name}
                            classNames={link.data.icon.classNames}
                            size={link.data.icon.size || 20}
                          />
                        </span>
                      )}

                      {link.data.label}

                      {/* Right Icon */}
                      {link.data.icon && link.data.iconPosition === "right" && (
                        <span className="ml-2">
                          <DynamicIcon
                            iconName={link.data.icon.name}
                            classNames={link.data.icon.classNames}
                            size={link.data.icon.size || 20}
                          />
                        </span>
                      )}
                    </a>
                  );
                }
              })}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
