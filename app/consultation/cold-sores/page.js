"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ColdSoresConsultation() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

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

    medicalConditions: "",
    pregnant: false,
    breastfeeding: false,
    renalImpairment: "",
    hepaticImpairment: "",
    allergyStatus: "",
    existingMedication: "",
    antimicrobialResistance: "",
    resistanceDetails: "",

    redFlagEmergency: false,
    urgentUnderOneMonth: false,
    urgentEyeInvolvement: false,
    urgentImmunocompromised: false,
    referralContraindications: false,
    referralPregnancy: false,
    referralSpreadingInfection: false,
    referralNotImproving14Days: false,
    referralSecondaryInfection: false,
    referralGingivostomatitis: false,
    referralErythemaMultiforme: false,
    referralHypersensitivity: false,
    limitedSupplyImmunocompromised: false,
    limitedSupplyRecurrentLesions: false,
    redFlagPresent: "",
    referralReason: "",

    symptomProdromal: false,
    symptomBlisters: false,
    symptomTenderGlands: false,
    symptomGingivostomatitis: false,
    childSoreGums: false,
    childSoreThroat: false,
    childMoreSaliva: false,
    childHighTemperature: false,
    childHeadaches: false,
    childRefusalFluids: false,
    symptomsTypical: "",
    symptomsReferralReason: "",

    meetsInclusionCriteria: false,
    proceedWithPrescribing: false,
    adviceAndCounselling: false,

    declarationClinicalInfoSharing: false,
    declarationDispensingChoice: false,
    dispenseToAnotherPharmacy: false,
    dispenseInThisPharmacy: false,
    consentSignature: "",
    guardianConsentSignature: "",
    consentDate: today,

    consultationOutcome: "",
    outcomeReferral: false,
    outcomePrescriptionIssued: false,
    outcomeSelfCareAdvice: false,
    outcomeNoTreatment: false,
    outcomeDetails: "",
    followUpAdviceGiven: false,
    safetyNettingGiven: false,

    pharmacistName: "",
    pharmacistRegistration: "",
    pharmacyName: "",
    pharmacistSignature: "",
    pharmacistDate: today,
    recordCompleted: false,
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
  const { name, value, type, checked } = e.target;

  setFormData((prev) => {
    const updated = {
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "sex" && value === "Male") {
      updated.pregnant = false;
      updated.breastfeeding = false;
    }

    return updated;
  });
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

  const validateStepThree = () => {
    const newErrors = {};

    if (!formData.medicalConditions.trim()) {
      newErrors.medicalConditions = "Required";
    }

    if (!formData.renalImpairment.trim()) {
      newErrors.renalImpairment = "Please select Yes or No";
    }

    if (!formData.hepaticImpairment.trim()) {
      newErrors.hepaticImpairment = "Please select Yes or No";
    }

    if (!formData.allergyStatus.trim()) {
      newErrors.allergyStatus = "Required";
    }

    if (!formData.existingMedication.trim()) {
      newErrors.existingMedication = "Required";
    }

    if (!formData.antimicrobialResistance.trim()) {
      newErrors.antimicrobialResistance = "Please select Yes or No";
    }

    if (
      formData.antimicrobialResistance === "Yes" &&
      !formData.resistanceDetails.trim()
    ) {
      newErrors.resistanceDetails = "Please list resistance details";
    }

    return newErrors;
  };

  const validateStepFour = () => {
    const newErrors = {};

    if (!formData.redFlagPresent.trim()) {
      newErrors.redFlagPresent = "Please select Yes or No";
    }

    if (formData.redFlagPresent === "Yes" && !formData.referralReason.trim()) {
      newErrors.referralReason = "Please document the reason for referral";
    }

    return newErrors;
  };

  const validateStepFive = () => {
    const newErrors = {};

    if (!formData.symptomsTypical.trim()) {
      newErrors.symptomsTypical = "Please select Yes or No";
    }

    if (
      formData.symptomsTypical === "No" &&
      !formData.symptomsReferralReason.trim()
    ) {
      newErrors.symptomsReferralReason =
        "Please document the reason for referral";
    }

    return newErrors;
  };

  const validateStepSix = () => {
    const newErrors = {};

    if (!formData.meetsInclusionCriteria) {
      newErrors.meetsInclusionCriteria = "Please confirm inclusion criteria";
    }

    if (!formData.proceedWithPrescribing) {
      newErrors.proceedWithPrescribing =
        "Please confirm prescribing suitability";
    }

    if (!formData.adviceAndCounselling) {
      newErrors.adviceAndCounselling =
        "Please confirm advice and counselling";
    }

    return newErrors;
  };

  const validateStepSeven = () => {
    const newErrors = {};

    if (!formData.declarationClinicalInfoSharing) {
      newErrors.declarationClinicalInfoSharing =
        "Please confirm clinical information sharing";
    }

    if (!formData.declarationDispensingChoice) {
      newErrors.declarationDispensingChoice =
        "Please confirm dispensing choice statement";
    }

    if (
      !formData.dispenseToAnotherPharmacy &&
      !formData.dispenseInThisPharmacy
    ) {
      newErrors.dispensingOption =
        "Please choose one dispensing option";
    }

    if (
      formData.dispenseToAnotherPharmacy &&
      formData.dispenseInThisPharmacy
    ) {
      newErrors.dispensingOption =
        "Please choose only one dispensing option";
    }

    if (!formData.consentSignature.trim()) {
      newErrors.consentSignature = "Signature is required";
    }

    if (isUnder16 && !formData.guardianConsentSignature.trim()) {
      newErrors.guardianConsentSignature =
        "Parent/guardian signature is required";
    }

    if (!formData.consentDate) {
      newErrors.consentDate = "Date is required";
    }

    return newErrors;
  };

  const validateStepEight = () => {
    const newErrors = {};

    if (!formData.consultationOutcome.trim()) {
      newErrors.consultationOutcome = "Please select an outcome";
    }

    if (
      !formData.outcomeReferral &&
      !formData.outcomePrescriptionIssued &&
      !formData.outcomeSelfCareAdvice &&
      !formData.outcomeNoTreatment
    ) {
      newErrors.outcomeType = "Please select at least one outcome type";
    }

    if (!formData.outcomeDetails.trim()) {
      newErrors.outcomeDetails = "Please document the consultation outcome";
    }

    if (!formData.followUpAdviceGiven) {
      newErrors.followUpAdviceGiven = "Please confirm follow-up advice";
    }

    if (!formData.safetyNettingGiven) {
      newErrors.safetyNettingGiven = "Please confirm safety-netting advice";
    }

    return newErrors;
  };

  const validateStepNine = () => {
    const newErrors = {};

    if (!formData.pharmacistName.trim()) {
      newErrors.pharmacistName = "Pharmacist name is required";
    }

    if (!formData.pharmacistRegistration.trim()) {
      newErrors.pharmacistRegistration = "Registration number is required";
    }

    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = "Pharmacy name is required";
    }

    if (!formData.pharmacistSignature.trim()) {
      newErrors.pharmacistSignature = "Signature is required";
    }

    if (!formData.pharmacistDate) {
      newErrors.pharmacistDate = "Date is required";
    }

    if (!formData.recordCompleted) {
      newErrors.recordCompleted = "Please confirm the record is complete";
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

    if (step === 3) {
      newErrors = validateStepThree();
    }

    if (step === 4) {
      newErrors = validateStepFour();
    }

    if (step === 5) {
      newErrors = validateStepFive();
    }

    if (step === 6) {
      newErrors = validateStepSix();
    }

    if (step === 7) {
      newErrors = validateStepSeven();
    }

    if (step === 8) {
      newErrors = validateStepEight();
    }

    if (step === 9) {
      newErrors = validateStepNine();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (step === 4 && formData.redFlagPresent === "Yes") {
      setStep(7);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

    const handleSaveConsultation = () => {
    const existingConsultations =
      JSON.parse(localStorage.getItem("rxflowConsultations")) || [];

    const newConsultation = {
      id: Date.now(),
      type: "Cold Sores Consultation",
      createdAt: new Date().toISOString(),
      patientName: formData.patientName,
      pharmacistName: formData.pharmacistName,
      data: formData,
    };

    localStorage.setItem(
      "rxflowConsultations",
      JSON.stringify([...existingConsultations, newConsultation])
    );

    alert("Consultation saved successfully.");
  };

  const handlePrintConsultation = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 text-slate-600 font-medium transition hover:-translate-x-1 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Consultation Types</span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <h1 className="mb-6 text-4xl font-bold text-slate-900">
          Cold Sores Consultation
        </h1>

        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <div
            className={
              step >= 1 ? "font-semibold text-sky-700" : "text-slate-500"
            }
          >
            1 Personal Details
          </div>

          <div
            className={
              step >= 2 ? "font-semibold text-sky-700" : "text-slate-500"
            }
          >
            2 Presenting Complaint
          </div>

          <div
            className={
              step >= 3 ? "font-semibold text-sky-700" : "text-slate-500"
            }
          >
            3 Medical History
          </div>

          <div
            className={
              step >= 4 ? "font-semibold text-sky-700" : "text-slate-500"
            }
          >
            4 Red Flags
          </div>

          <div
            className={
              step >= 5 ? "font-semibold text-sky-700" : "text-slate-400"
            }
          >
            5 Review of Symptoms
          </div>

          <div
            className={
              step >= 6 ? "font-semibold text-sky-700" : "text-slate-400"
            }
          >
            6 Treatment Options
          </div>

          <div
            className={
              step >= 7 ? "font-semibold text-sky-700" : "text-slate-400"
            }
          >
            7 Patient Declaration
          </div>

          <div className={
            step >= 8 ? "font-semibold text-sky-700" : "text-slate-400"
            }
          >
            8 Consultation Outcome
          </div>

          <div className={
            step >= 9 ? "font-semibold text-sky-700" : "text-slate-400"}
          >
            9 Pharmacist Record
          </div>

          <div className={
            step >= 10 ? "font-semibold text-sky-700" : "text-slate-400"}
          >
            10 Overview
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.patientName}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.contact}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.eircode}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.ppsn}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.schemeNumber}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.schemeType}
                    </p>
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
                      <p className="mt-1 text-sm text-red-500">
                        {errors.guardian}
                      </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.gpName}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.gpContact}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.gpAddress}
                    </p>
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.symptoms}
                    </p>
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

          {step === 3 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Medical History
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Existing Health Conditions
                  </label>
                  <textarea
                    name="medicalConditions"
                    placeholder="List existing health conditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className={getInputClass("medicalConditions") + " h-28"}
                  />
                  {errors.medicalConditions && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.medicalConditions}
                    </p>
                  )}
                </div>

                {formData.sex === "Female" && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="pregnant"
                        checked={formData.pregnant}
                        onChange={handleChange}
                      />
                      Pregnant or suspected pregnancy
                    </label>

                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="breastfeeding"
                        checked={formData.breastfeeding}
                        onChange={handleChange}
                      />
                      Breastfeeding
                    </label>
                  </div>
                )}

                {formData.pregnant && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    Refer patient to GP or other relevant medical practitioner.
                  </div>
                )}

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Any known renal (kidney) impairment?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="renalImpairment"
                          value={option}
                          checked={formData.renalImpairment === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.renalImpairment && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.renalImpairment}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Any known hepatic (liver) impairment?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="hepaticImpairment"
                          value={option}
                          checked={formData.hepaticImpairment === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.hepaticImpairment && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.hepaticImpairment}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Allergy Status
                  </label>
                  <input
                    name="allergyStatus"
                    placeholder="Enter allergy status"
                    value={formData.allergyStatus}
                    onChange={handleChange}
                    className={getInputClass("allergyStatus")}
                  />
                  {errors.allergyStatus && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.allergyStatus}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Existing Medication
                  </label>
                  <textarea
                    name="existingMedication"
                    placeholder="List existing medication"
                    value={formData.existingMedication}
                    onChange={handleChange}
                    className={getInputClass("existingMedication") + " h-28"}
                  />
                  {errors.existingMedication && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.existingMedication}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Is patient aware if they have resistance to previous antimicrobial treatment?
                  </p>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="antimicrobialResistance"
                          value={option}
                          checked={formData.antimicrobialResistance === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.antimicrobialResistance && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.antimicrobialResistance}
                    </p>
                  )}
                </div>

                {formData.antimicrobialResistance === "Yes" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      If yes, please list
                    </label>
                    <textarea
                      name="resistanceDetails"
                      placeholder="Enter resistance details"
                      value={formData.resistanceDetails}
                      onChange={handleChange}
                      className={getInputClass("resistanceDetails") + " h-24"}
                    />
                    {errors.resistanceDetails && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.resistanceDetails}
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

          {step === 4 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Red Flag and Referral Criteria
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    4.1 Emergency Referral
                  </h3>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="redFlagEmergency"
                      checked={formData.redFlagEmergency}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>
                      Individual is systemically very unwell, or showing symptoms of severe/life-threatening infection, or systemic sepsis.
                      Refer urgently to Emergency Department via ambulance.
                    </span>
                  </label>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    4.2 Urgent Medical Assessment
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="urgentUnderOneMonth"
                        checked={formData.urgentUnderOneMonth}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Individuals under 1 month of age</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="urgentEyeInvolvement"
                        checked={formData.urgentEyeInvolvement}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Lesions involving the eye</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="urgentImmunocompromised"
                        checked={formData.urgentImmunocompromised}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>
                        Individual has moderate to severe immunocompromise due to underlying medical conditions or treatments
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    4.3 Referral to GP or Other Relevant Medical Practitioner
                  </h3>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralContraindications"
                        checked={formData.referralContraindications}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Contraindications as specified in the medication Summary of Product Characteristics</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralPregnancy"
                        checked={formData.referralPregnancy}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Pregnancy or suspected pregnancy</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralSpreadingInfection"
                        checked={formData.referralSpreadingInfection}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Signs of infection spreading</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralNotImproving14Days"
                        checked={formData.referralNotImproving14Days}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Symptoms not improving within 14 days, with or without treatment</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralSecondaryInfection"
                        checked={formData.referralSecondaryInfection}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Signs of secondary infection, e.g. very painful or very swollen</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralGingivostomatitis"
                        checked={formData.referralGingivostomatitis}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Suspected gingivostomatitis</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralErythemaMultiforme"
                        checked={formData.referralErythemaMultiforme}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Suspected erythema multiforme</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="referralHypersensitivity"
                        checked={formData.referralHypersensitivity}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Known hypersensitivity or adverse reaction to medication treatment options or components</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    4.4 Initial Limited Supply Permitted
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="limitedSupplyImmunocompromised"
                        checked={formData.limitedSupplyImmunocompromised}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>
                        Individual is immunocompromised due to underlying medical conditions or treatments
                      </span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="limitedSupplyRecurrentLesions"
                        checked={formData.limitedSupplyRecurrentLesions}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>
                        Recurrent problematic lesions or frequently recurrent infection
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Are there any Red Flag or Referral Criteria present?
                  </p>

                  <div className="flex gap-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="redFlagPresent"
                          value={option}
                          checked={formData.redFlagPresent === option}
                          onChange={handleChange}
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {errors.redFlagPresent && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.redFlagPresent}
                    </p>
                  )}
                </div>

                {formData.redFlagPresent === "Yes" && (
                  <>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                      Red flag or referral criteria present. Refer patient and document the reason below.
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Reason for referral
                      </label>
                      <textarea
                        name="referralReason"
                        placeholder="Document reason for referral"
                        value={formData.referralReason}
                        onChange={handleChange}
                        className={getInputClass("referralReason") + " h-24"}
                      />
                      {errors.referralReason && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.referralReason}
                        </p>
                      )}
                    </div>
                  </>
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

          {step === 5 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Review of Symptoms
            </h2>

            <div className="space-y-8">
              <div>
                <p className="mb-4 text-sm font-medium text-slate-700">
                  Listed below are the signs and symptoms that are typical of cold sores, tick all that apply:
                </p>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="symptomProdromal"
                      checked={formData.symptomProdromal}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Prodromal phase - tingling, itching or burning feeling on lip</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="symptomBlisters"
                      checked={formData.symptomBlisters}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Fluid-filled blisters may appear, weep and crust over into a scab</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="symptomTenderGlands"
                      checked={formData.symptomTenderGlands}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Swollen and tender glands</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="symptomGingivostomatitis"
                      checked={formData.symptomGingivostomatitis}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Clusters of blisters or sores may develop inside the mouth – known as Gingivostomatitis</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-4 text-sm font-medium text-slate-700">
                  Other symptoms in children may include:
                </p>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="childSoreGums"
                      checked={formData.childSoreGums}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Sore gums</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="childSoreThroat"
                      checked={formData.childSoreThroat}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Sore throat and swollen glands</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="childMoreSaliva"
                      checked={formData.childMoreSaliva}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>More saliva than normal</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="childHighTemperature"
                      checked={formData.childHighTemperature}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>High temperature</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="childHeadaches"
                      checked={formData.childHeadaches}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Headaches</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="childRefusalFluids"
                      checked={formData.childRefusalFluids}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Refusal to drink fluids</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Are symptoms typical of cold sores?
                </p>

                <div className="flex gap-6">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="symptomsTypical"
                        value={option}
                        checked={formData.symptomsTypical === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {errors.symptomsTypical && (
                  <p className="mt-1 text-sm text-red-500">{errors.symptomsTypical}</p>
                )}
              </div>

              {formData.symptomsTypical === "No" && (
                <>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                    Symptoms are not typical of cold sores. Refer patient and document the reason below.
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Reason for referral
                    </label>
                    <textarea
                      name="symptomsReferralReason"
                      placeholder="Document reason for referral"
                      value={formData.symptomsReferralReason}
                      onChange={handleChange}
                      className={getInputClass("symptomsReferralReason") + " h-24"}
                    />
                    {errors.symptomsReferralReason && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.symptomsReferralReason}
                      </p>
                    )}
                  </div>
                </>
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

        {step === 6 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Treatment Options
            </h2>

            <div className="space-y-5">
              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="meetsInclusionCriteria"
                    checked={formData.meetsInclusionCriteria}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    Individual meets the inclusion criteria as per protocol.
                  </span>
                </label>
                {errors.meetsInclusionCriteria && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.meetsInclusionCriteria}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="proceedWithPrescribing"
                    checked={formData.proceedWithPrescribing}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    Appropriate to proceed with pharmacist prescribing and refer to
                    protocol for prescribing information.
                  </span>
                </label>
                {errors.proceedWithPrescribing && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.proceedWithPrescribing}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="adviceAndCounselling"
                    checked={formData.adviceAndCounselling}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    Give advice and counselling as per protocol.
                  </span>
                </label>
                {errors.adviceAndCounselling && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.adviceAndCounselling}
                  </p>
                )}
              </div>
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
        
        {step === 7 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Patient Declaration
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>
                    • I understand the nature of the condition, how the treatment works,
                    the benefits and risks of the treatment.
                  </li>
                  <li>
                    • I have been given the opportunity to speak to the pharmacist
                    providing the consultation and to ask questions.
                  </li>
                  <li>
                    • I have been given information on what steps to take if my symptoms
                    get worse or persist for longer than 14 days.
                  </li>
                  <li>
                    • The information and details I have provided are accurate and will
                    be recorded by the pharmacy as required.
                  </li>
                  <li>
                    • I understand that any data collected will be processed in
                    accordance with relevant data protection requirements.
                  </li>
                </ul>
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="declarationClinicalInfoSharing"
                    checked={formData.declarationClinicalInfoSharing}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    I agree to the sharing of relevant clinical information with another
                    healthcare professional if deemed necessary by the pharmacist.
                  </span>
                </label>
                {errors.declarationClinicalInfoSharing && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.declarationClinicalInfoSharing}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="declarationDispensingChoice"
                    checked={formData.declarationDispensingChoice}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    I understand that I can have this prescription dispensed in this
                    pharmacy or that I can choose to have it dispensed in another
                    pharmacy of my choice.
                  </span>
                </label>
                {errors.declarationDispensingChoice && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.declarationDispensingChoice}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Please choose one dispensing option
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="dispenseToAnotherPharmacy"
                      checked={formData.dispenseToAnotherPharmacy}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          dispenseToAnotherPharmacy: checked,
                          dispenseInThisPharmacy: checked
                            ? false
                            : prev.dispenseInThisPharmacy,
                        }));
                      }}
                    />
                    <span>I am choosing to take my prescription to another pharmacy</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="dispenseInThisPharmacy"
                      checked={formData.dispenseInThisPharmacy}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          dispenseInThisPharmacy: checked,
                          dispenseToAnotherPharmacy: checked
                            ? false
                            : prev.dispenseToAnotherPharmacy,
                        }));
                      }}
                    />
                    <span>I have chosen to have my prescription dispensed in this pharmacy</span>
                  </label>
                </div>

                {errors.dispensingOption && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.dispensingOption}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Signature of person providing consent
                  </label>
                  <input
                    name="consentSignature"
                    placeholder="Type full name as signature"
                    value={formData.consentSignature}
                    onChange={handleChange}
                    className={getInputClass("consentSignature")}
                  />
                  {errors.consentSignature && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.consentSignature}
                    </p>
                  )}
                </div>

                {isUnder16 && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Signature of parent/guardian providing consent if child is under 16 years
                    </label>
                    <input
                      name="guardianConsentSignature"
                      placeholder="Type parent/guardian full name as signature"
                      value={formData.guardianConsentSignature}
                      onChange={handleChange}
                      className={getInputClass("guardianConsentSignature")}
                    />
                    {errors.guardianConsentSignature && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.guardianConsentSignature}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="consentDate"
                    value={formData.consentDate}
                    onChange={handleChange}
                    className={getInputClass("consentDate")}
                  />
                  {errors.consentDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.consentDate}</p>
                  )}
                </div>
              </div>
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

        {step === 8 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Consultation Outcome
            </h2>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Consultation outcome
                </p>

                <div className="flex flex-wrap gap-6">
                  {[
                    "Referral",
                    "Prescription Issued",
                    "Self-Care Advice",
                    "No Treatment",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="consultationOutcome"
                        value={option}
                        checked={formData.consultationOutcome === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {errors.consultationOutcome && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.consultationOutcome}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Tick all that apply
                </p>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="outcomeReferral"
                      checked={formData.outcomeReferral}
                      onChange={handleChange}
                    />
                    <span>Referred to GP / other medical practitioner</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="outcomePrescriptionIssued"
                      checked={formData.outcomePrescriptionIssued}
                      onChange={handleChange}
                    />
                    <span>Prescription issued</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="outcomeSelfCareAdvice"
                      checked={formData.outcomeSelfCareAdvice}
                      onChange={handleChange}
                    />
                    <span>Self-care advice provided</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="outcomeNoTreatment"
                      checked={formData.outcomeNoTreatment}
                      onChange={handleChange}
                    />
                    <span>No treatment supplied</span>
                  </label>
                </div>

                {errors.outcomeType && (
                  <p className="mt-1 text-sm text-red-500">{errors.outcomeType}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Outcome details
                </label>
                <textarea
                  name="outcomeDetails"
                  placeholder="Document treatment supplied, referral decision, advice provided, or relevant outcome notes"
                  value={formData.outcomeDetails}
                  onChange={handleChange}
                  className={getInputClass("outcomeDetails") + " h-28"}
                />
                {errors.outcomeDetails && (
                  <p className="mt-1 text-sm text-red-500">{errors.outcomeDetails}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="followUpAdviceGiven"
                    checked={formData.followUpAdviceGiven}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>Follow-up advice has been given to the patient</span>
                </label>
                {errors.followUpAdviceGiven && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.followUpAdviceGiven}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="safetyNettingGiven"
                    checked={formData.safetyNettingGiven}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    Safety-netting advice has been given, including what to do if symptoms worsen or do not improve
                  </span>
                </label>
                {errors.safetyNettingGiven && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.safetyNettingGiven}
                  </p>
                )}
              </div>
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

        {step === 9 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Pharmacist Record
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Pharmacist Name
                  </label>
                  <input
                    name="pharmacistName"
                    placeholder="Enter pharmacist name"
                    value={formData.pharmacistName}
                    onChange={handleChange}
                    className={getInputClass("pharmacistName")}
                  />
                  {errors.pharmacistName && (
                    <p className="mt-1 text-sm text-red-500">{errors.pharmacistName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Registration Number
                  </label>
                  <input
                    name="pharmacistRegistration"
                    placeholder="Enter registration number"
                    value={formData.pharmacistRegistration}
                    onChange={handleChange}
                    className={getInputClass("pharmacistRegistration")}
                  />
                  {errors.pharmacistRegistration && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.pharmacistRegistration}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Pharmacy Name
                  </label>
                  <input
                    name="pharmacyName"
                    placeholder="Enter pharmacy name"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    className={getInputClass("pharmacyName")}
                  />
                  {errors.pharmacyName && (
                    <p className="mt-1 text-sm text-red-500">{errors.pharmacyName}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Pharmacist Signature
                  </label>
                  <input
                    name="pharmacistSignature"
                    placeholder="Type full name as signature"
                    value={formData.pharmacistSignature}
                    onChange={handleChange}
                    className={getInputClass("pharmacistSignature")}
                  />
                  {errors.pharmacistSignature && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.pharmacistSignature}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="pharmacistDate"
                    value={formData.pharmacistDate}
                    onChange={handleChange}
                    className={getInputClass("pharmacistDate")}
                  />
                  {errors.pharmacistDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.pharmacistDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="recordCompleted"
                    checked={formData.recordCompleted}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    I confirm that this consultation record is complete and accurate.
                  </span>
                </label>
                {errors.recordCompleted && (
                  <p className="mt-1 text-sm text-red-500">{errors.recordCompleted}</p>
                )}
              </div>
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

                {step === 10 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Consultation Overview
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Patient Details
                </h3>

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                  <p><span className="font-medium">Patient Name:</span> {formData.patientName || "-"}</p>
                  <p><span className="font-medium">Contact:</span> {formData.contact || "-"}</p>
                  <p><span className="font-medium">Address:</span> {formData.address || "-"}</p>
                  <p><span className="font-medium">Eircode:</span> {formData.eircode || "-"}</p>
                  <p><span className="font-medium">PPSN:</span> {formData.ppsn || "-"}</p>
                  <p><span className="font-medium">Scheme Number:</span> {formData.schemeNumber || "-"}</p>
                  <p><span className="font-medium">Scheme Type:</span> {formData.schemeType || "-"}</p>
                  <p><span className="font-medium">DOB:</span> {formData.dob || "-"}</p>
                  <p><span className="font-medium">Age:</span> {age || "-"}</p>
                  <p><span className="font-medium">Sex:</span> {formData.sex || "-"}</p>
                  <p><span className="font-medium">GP Name:</span> {formData.gpName || "-"}</p>
                  <p><span className="font-medium">GP Contact:</span> {formData.gpContact || "-"}</p>
                  <p className="md:col-span-2"><span className="font-medium">GP Address:</span> {formData.gpAddress || "-"}</p>
                  {isUnder16 && (
                    <p className="md:col-span-2">
                      <span className="font-medium">Guardian:</span> {formData.guardian || "-"}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Presenting Complaint
                </h3>

                <div className="space-y-3 text-sm text-slate-700">
                  <p><span className="font-medium">Symptoms:</span> {formData.symptoms || "-"}</p>
                  <p><span className="font-medium">Medication Tried:</span> {formData.medicationTried || "-"}</p>
                  <p><span className="font-medium">Medication List:</span> {formData.medicationList || "-"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Medical History
                </h3>

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                  <p><span className="font-medium">Medical Conditions:</span> {formData.medicalConditions || "-"}</p>
                  <p><span className="font-medium">Pregnant:</span> {formData.pregnant ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Breastfeeding:</span> {formData.breastfeeding ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Renal Impairment:</span> {formData.renalImpairment || "-"}</p>
                  <p><span className="font-medium">Hepatic Impairment:</span> {formData.hepaticImpairment || "-"}</p>
                  <p><span className="font-medium">Allergy Status:</span> {formData.allergyStatus || "-"}</p>
                  <p className="md:col-span-2"><span className="font-medium">Existing Medication:</span> {formData.existingMedication || "-"}</p>
                  <p><span className="font-medium">Antimicrobial Resistance:</span> {formData.antimicrobialResistance || "-"}</p>
                  <p className="md:col-span-2"><span className="font-medium">Resistance Details:</span> {formData.resistanceDetails || "-"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Red Flags / Symptoms / Treatment
                </h3>

                <div className="space-y-3 text-sm text-slate-700">
                  <p><span className="font-medium">Red Flag Present:</span> {formData.redFlagPresent || "-"}</p>
                  <p><span className="font-medium">Referral Reason:</span> {formData.referralReason || "-"}</p>
                  <p><span className="font-medium">Symptoms Typical:</span> {formData.symptomsTypical || "-"}</p>
                  <p><span className="font-medium">Symptoms Referral Reason:</span> {formData.symptomsReferralReason || "-"}</p>
                  <p><span className="font-medium">Meets Inclusion Criteria:</span> {formData.meetsInclusionCriteria ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Proceed With Prescribing:</span> {formData.proceedWithPrescribing ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Advice And Counselling:</span> {formData.adviceAndCounselling ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Declaration / Outcome / Pharmacist Record
                </h3>

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                  <p><span className="font-medium">Consent Signature:</span> {formData.consentSignature || "-"}</p>
                  <p><span className="font-medium">Consent Date:</span> {formData.consentDate || "-"}</p>
                  {isUnder16 && (
                    <p className="md:col-span-2">
                      <span className="font-medium">Guardian Consent Signature:</span> {formData.guardianConsentSignature || "-"}
                    </p>
                  )}
                  <p><span className="font-medium">Consultation Outcome:</span> {formData.consultationOutcome || "-"}</p>
                  <p className="md:col-span-2"><span className="font-medium">Outcome Details:</span> {formData.outcomeDetails || "-"}</p>
                  <p><span className="font-medium">Follow-up Advice Given:</span> {formData.followUpAdviceGiven ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Safety Netting Given:</span> {formData.safetyNettingGiven ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Pharmacist Name:</span> {formData.pharmacistName || "-"}</p>
                  <p><span className="font-medium">Registration Number:</span> {formData.pharmacistRegistration || "-"}</p>
                  <p><span className="font-medium">Pharmacy Name:</span> {formData.pharmacyName || "-"}</p>
                  <p><span className="font-medium">Pharmacist Signature:</span> {formData.pharmacistSignature || "-"}</p>
                  <p><span className="font-medium">Pharmacist Date:</span> {formData.pharmacistDate || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveConsultation}
                  className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={handlePrintConsultation}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Print
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/consultation")}
                  className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
