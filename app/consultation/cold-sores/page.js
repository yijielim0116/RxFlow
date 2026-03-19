"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ColdSoresConsultation() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    patientName: "",
    address: "",
    eircode: "",
    ppsn: "",
    contact: "",
    schemeNumber: "",
    schemeType: "",
    guardian: "",
    dob: "",
    sex: "",
    gpName: "",
    gpAddress: "",
    gpContact: "",

    symptoms: "",
    medicationTried: "",
    medicationList: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  const age = useMemo(() => {
    if (!formData.dob) return "";

    const dobDate = new Date(formData.dob);
    const today = new Date();

    let years = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      years--;
    }

    return years >= 0 ? years.toString() : "";
  }, [formData.dob]);

  const isUnder16 = age !== "" && Number(age) < 16;

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getInputClass = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition ${
      errors[fieldName]
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
    }`;

  const validateStepOne = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) newErrors.patientName = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.eircode.trim()) newErrors.eircode = "Required";
    if (!formData.ppsn.trim()) newErrors.ppsn = "Required";
    if (!formData.contact.trim()) newErrors.contact = "Required";
    if (!formData.schemeNumber.trim()) newErrors.schemeNumber = "Required";
    if (!formData.schemeType.trim()) newErrors.schemeType = "Required";
    if (!formData.dob) newErrors.dob = "Required";
    if (!formData.sex.trim()) newErrors.sex = "Required";
    if (!formData.gpName.trim()) newErrors.gpName = "Required";
    if (!formData.gpAddress.trim()) newErrors.gpAddress = "Required";
    if (!formData.gpContact.trim()) newErrors.gpContact = "Required";

    if (isUnder16 && !formData.guardian.trim()) {
      newErrors.guardian = "Required for patients under 16";
    }

    return newErrors;
  };

  const validateStepTwo = () => {
    const newErrors = {};

    if (!formData.symptoms.trim()) newErrors.symptoms = "Required";
    if (!formData.medicationTried.trim()) {
      newErrors.medicationTried = "Please select Yes or No";
    }

    if (
      formData.medicationTried === "Yes" &&
      !formData.medicationList.trim()
    ) {
      newErrors.medicationList = "Please list medication already tried";
    }

    return newErrors;
  };

  const nextStep = () => {
    let newErrors = {};

    if (step === 1) {
      newErrors = validateStepOne();
    }

    if (step === 2) {
      newErrors = validateStepTwo();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <h1 className="mb-6 text-4xl font-bold text-slate-900">
          Cold Sores Consultation
        </h1>

        {/* Progress */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <div className={step >= 1 ? "font-semibold text-sky-700" : "text-slate-500"}>
            1 Personal Details
          </div>

          <div className={step >= 2 ? "font-semibold text-sky-700" : "text-slate-500"}>
            2 Presenting Complaint
          </div>

          <div className={step >= 3 ? "font-semibold text-sky-700" : "text-slate-400"}>
            3 Medical History
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Personal Details
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <input
                    name="patientName"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleChange}
                    className={getInputClass("patientName")}
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-sm text-red-500">{errors.patientName}</p>
                  )}
                </div>

                <div>
                  <input
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    className={getInputClass("contact")}
                  />
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className={getInputClass("address")}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div>
                  <input
                    name="eircode"
                    placeholder="Eircode"
                    value={formData.eircode}
                    onChange={handleChange}
                    className={getInputClass("eircode")}
                  />
                  {errors.eircode && (
                    <p className="mt-1 text-sm text-red-500">{errors.eircode}</p>
                  )}
                </div>

                <div>
                  <input
                    name="ppsn"
                    placeholder="PPSN"
                    value={formData.ppsn}
                    onChange={handleChange}
                    className={getInputClass("ppsn")}
                  />
                  {errors.ppsn && (
                    <p className="mt-1 text-sm text-red-500">{errors.ppsn}</p>
                  )}
                </div>

                <div>
                  <input
                    name="schemeNumber"
                    placeholder="Scheme Number"
                    value={formData.schemeNumber}
                    onChange={handleChange}
                    className={getInputClass("schemeNumber")}
                  />
                  {errors.schemeNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.schemeNumber}</p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={getInputClass("dob")}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-500">{errors.dob}</p>
                  )}
                </div>

                <div>
                  <input
                    value={age}
                    readOnly
                    placeholder="Age"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Scheme Type
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["GMS", "DPS", "GP Visit", "Private"].map((scheme) => (
                      <label
                        key={scheme}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="schemeType"
                          value={scheme}
                          checked={formData.schemeType === scheme}
                          onChange={handleChange}
                        />
                        {scheme}
                      </label>
                    ))}
                  </div>
                  {errors.schemeType && (
                    <p className="mt-1 text-sm text-red-500">{errors.schemeType}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Sex
                  </p>
                  <div className="flex gap-6">
                    {["Male", "Female"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="sex"
                          value={option}
                          checked={formData.sex === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-500">{errors.sex}</p>
                  )}
                </div>

                {isUnder16 && (
                  <div className="md:col-span-2">
                    <input
                      name="guardian"
                      placeholder="Parent/Guardian Name (if patient under 16 years)"
                      value={formData.guardian}
                      onChange={handleChange}
                      className={getInputClass("guardian")}
                    />
                    {errors.guardian && (
                      <p className="mt-1 text-sm text-red-500">{errors.guardian}</p>
                    )}
                  </div>
                )}

                <div>
                  <input
                    name="gpName"
                    placeholder="GP Name"
                    value={formData.gpName}
                    onChange={handleChange}
                    className={getInputClass("gpName")}
                  />
                  {errors.gpName && (
                    <p className="mt-1 text-sm text-red-500">{errors.gpName}</p>
                  )}
                </div>

                <div>
                  <input
                    name="gpContact"
                    placeholder="GP Contact Number"
                    value={formData.gpContact}
                    onChange={handleChange}
                    className={getInputClass("gpContact")}
                  />
                  {errors.gpContact && (
                    <p className="mt-1 text-sm text-red-500">{errors.gpContact}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    name="gpAddress"
                    placeholder="GP Address"
                    value={formData.gpAddress}
                    onChange={handleChange}
                    className={getInputClass("gpAddress")}
                  />
                  {errors.gpAddress && (
                    <p className="mt-1 text-sm text-red-500">{errors.gpAddress}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Presenting Complaint
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Document the symptoms of the presenting complaint as described by the patient
                  </label>
                  <textarea
                    name="symptoms"
                    placeholder="Enter symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    className={getInputClass("symptoms") + " h-32"}
                  />
                  {errors.symptoms && (
                    <p className="mt-1 text-sm text-red-500">{errors.symptoms}</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Any medication already tried for the management of cold sores symptoms?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="medicationTried"
                          value={option}
                          checked={formData.medicationTried === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.medicationTried && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.medicationTried}
                    </p>
                  )}
                </div>

                {formData.medicationTried === "Yes" && (
                  <div>
                    <textarea
                      name="medicationList"
                      placeholder="If yes, please list"
                      value={formData.medicationList}
                      onChange={handleChange}
                      className={getInputClass("medicationList")}
                    />
                    {errors.medicationList && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.medicationList}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 Placeholder */}
          {step === 3 && (
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                Medical History
              </h2>
              <p className="text-slate-600">
                This section will be added next.
              </p>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}