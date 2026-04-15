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

    consultationOutcomeReferral: false,
    consultationOutcomeSelfCare: false,
    consultationOutcomeOTCProduct: false,
    consultationOutcomePOMSupplied: false,

    declinedTreatment: false,
    declinedTreatmentReason: "",

    referredToAE: false,
    referredToGP: false,
    referredToOther: false,
    referredToOtherDetails: "",

    prescribedAciclovirCream: false,

    pharmacistName: "",
    psiNumber: "",
    pharmacyAddress: "",
    pharmacyEircode: "",
    pharmacistSignature: "",
    pharmacistDate: today,
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
    `w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition ${errors[fieldName]
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

    if (
      !formData.consultationOutcomeReferral &&
      !formData.consultationOutcomeSelfCare &&
      !formData.consultationOutcomeOTCProduct &&
      !formData.consultationOutcomePOMSupplied
    ) {
      newErrors.consultationOutcome =
        "Please select at least one consultation outcome";
    }

    if (formData.declinedTreatment && !formData.declinedTreatmentReason.trim()) {
      newErrors.declinedTreatmentReason = "Please provide a reason";
    }

    if (formData.consultationOutcomeReferral) {
      if (
        !formData.referredToAE &&
        !formData.referredToGP &&
        !formData.referredToOther
      ) {
        newErrors.referredTo = "Please select where the patient was referred to";
      }

      if (formData.referredToOther && !formData.referredToOtherDetails.trim()) {
        newErrors.referredToOtherDetails = "Please specify other referral destination";
      }
    }

    if (
      formData.consultationOutcomePOMSupplied &&
      !formData.prescribedAciclovirCream
    ) {
      newErrors.prescribedAciclovirCream =
        "Please select the prescribed medicine";
    }

    return newErrors;
  };

  const validateStepNine = () => {
    const newErrors = {};

    if (!formData.pharmacistName.trim()) {
      newErrors.pharmacistName = "Pharmacist name is required";
    }

    if (!formData.psiNumber.trim()) {
      newErrors.psiNumber = "PSI number is required";
    }

    if (!formData.pharmacyAddress.trim()) {
      newErrors.pharmacyAddress = "Pharmacy address is required";
    }

    if (!formData.pharmacyEircode.trim()) {
      newErrors.pharmacyEircode = "Eircode is required";
    }

    if (!formData.pharmacistSignature.trim()) {
      newErrors.pharmacistSignature = "Signature is required";
    }

    if (!formData.pharmacistDate) {
      newErrors.pharmacistDate = "Date is required";
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
    if (step === 7 && formData.redFlagPresent === "Yes") {
      setStep(4);
      return;
    }

    setStep((prev) => prev - 1);
  };

  const handleSaveAndFinish = () => {
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

    router.push("/recent-consultations");
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
                    placeholder="GP Name (Optional)"
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
                    placeholder="GP Contact Number (Optional)"
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
                    placeholder="GP Address (Optional)"
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
                  <h3 className="mb-3 text-lg font-semibold text-red-700">
                    4.1 Criteria requiring EMERGENCY referral to hospital emergency department/contacting emergency services, as per 2.4.1 of Protocol.
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
                  <h3 className="mb-3 text-lg font-semibold text-amber-700">
                    4.2 Criteria requiring Urgent Medical Assessment (treating service/GP/GP out of hours/hospital emergency department),as per 2.4.2 of Protocol. If ANY of the following are present, then urgent medical assessment is required.
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
                  <h3 className="mb-3 text-lg font-semibold text-sky-700">
                    4.3 Criteria requiring referral to GP or other relevant medical practitioner, but pharmacist permitted to give INITIAL LIMITED SUPPLY, as per 2.4.3 of protocol. If ANY of the following are present then referral is required and pharmacist prescribing is not permitted.
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
                  <h3 className="mb-3 text-lg font-semibold text-emerald-900">
                    4.4 Criteria requiring referral to GP or other relevant medical practitioner, but pharmacist permitted to give INITIAL LIMITED SUPPLY, as per 2.4.4 of Protocol.
                  </h3>

                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Pharmacists can consider prescribing an initial limited supply of treatment if clinically appropriate to mitigate the risk of delay in access to treatment. Treatment should be limited to the dose or time necessary for an individual to access the referral pathway.
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

              <div className="space-y-8">
                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="consultationOutcomeReferral"
                        checked={formData.consultationOutcomeReferral}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Referral</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="consultationOutcomeSelfCare"
                        checked={formData.consultationOutcomeSelfCare}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Self-care</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="consultationOutcomeOTCProduct"
                        checked={formData.consultationOutcomeOTCProduct}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>OTC Product Supplied</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="consultationOutcomePOMSupplied"
                        checked={formData.consultationOutcomePOMSupplied}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>Prescription for POM supplied</span>
                    </label>
                  </div>

                  {errors.consultationOutcome && (
                    <p className="mt-2 text-sm text-red-500">{errors.consultationOutcome}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="declinedTreatment"
                      checked={formData.declinedTreatment}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span>Patient has declined treatment, please give reason:</span>
                  </label>

                  {formData.declinedTreatment && (
                    <textarea
                      name="declinedTreatmentReason"
                      placeholder="Enter reason"
                      value={formData.declinedTreatmentReason}
                      onChange={handleChange}
                      className={getInputClass("declinedTreatmentReason") + " mt-3 h-24"}
                    />
                  )}

                  {errors.declinedTreatmentReason && (
                    <p className="mt-1 text-sm text-red-500">{errors.declinedTreatmentReason}</p>
                  )}
                </div>

                {formData.consultationOutcomeReferral && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">
                      8.1 Referred to
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="flex items-start gap-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          name="referredToAE"
                          checked={formData.referredToAE}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>Accident & Emergency Department</span>
                      </label>

                      <label className="flex items-start gap-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          name="referredToGP"
                          checked={formData.referredToGP}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>General Practitioner (GP)</span>
                      </label>

                      <label className="flex items-start gap-3 text-sm text-slate-700 md:col-span-2">
                        <input
                          type="checkbox"
                          name="referredToOther"
                          checked={formData.referredToOther}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <span>Other (please specify)</span>
                      </label>
                    </div>

                    {formData.referredToOther && (
                      <textarea
                        name="referredToOtherDetails"
                        placeholder="Specify other referral destination"
                        value={formData.referredToOtherDetails}
                        onChange={handleChange}
                        className={getInputClass("referredToOtherDetails") + " mt-3 h-20"}
                      />
                    )}

                    {errors.referredTo && (
                      <p className="mt-2 text-sm text-red-500">{errors.referredTo}</p>
                    )}

                    {errors.referredToOtherDetails && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.referredToOtherDetails}
                      </p>
                    )}
                  </div>
                )}

                {formData.consultationOutcomePOMSupplied && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-amber-800">
                      8.2 Medicine Prescribed
                    </h3>

                    <p className="mb-4 text-sm text-slate-600">
                      Please see Protocol and SPCs for dosage and notes for each individual medicinal product.
                    </p>

                    <label className="flex items-start gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="prescribedAciclovirCream"
                        checked={formData.prescribedAciclovirCream}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span>
                        Aciclovir 5% w/w cream, applied five times daily at approximately
                        four hourly intervals omitting the night time application, for at
                        least four days. If healing has not occurred, treatment may be
                        continued for up to 10 days.
                      </span>
                    </label>

                    {errors.prescribedAciclovirCream && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.prescribedAciclovirCream}
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

          {step === 9 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Pharmacist Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      First & Last Name
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
                      Pharmacy Address
                    </label>
                    <input
                      name="pharmacyAddress"
                      placeholder="Enter pharmacy address"
                      value={formData.pharmacyAddress}
                      onChange={handleChange}
                      className={getInputClass("pharmacyAddress")}
                    />
                    {errors.pharmacyAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.pharmacyAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      PSI No.
                    </label>
                    <input
                      name="psiNumber"
                      placeholder="Enter PSI number"
                      value={formData.psiNumber}
                      onChange={handleChange}
                      className={getInputClass("psiNumber")}
                    />
                    {errors.psiNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.psiNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Eircode
                    </label>
                    <input
                      name="pharmacyEircode"
                      placeholder="Enter eircode"
                      value={formData.pharmacyEircode}
                      onChange={handleChange}
                      className={getInputClass("pharmacyEircode")}
                    />
                    {errors.pharmacyEircode && (
                      <p className="mt-1 text-sm text-red-500">{errors.pharmacyEircode}</p>
                    )}
                  </div>

                  <div>
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
            </div>
          )}

          {step === 10 && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Consultation Overview
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    1. Personal Details
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

                {/* Step 2 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    2. Presenting Complaint
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Symptoms:</span> {formData.symptoms || "-"}</p>
                    <p><span className="font-medium">Medication Tried:</span> {formData.medicationTried || "-"}</p>
                    <p><span className="font-medium">Medication List:</span> {formData.medicationList || "-"}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    3. Medical History
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

                {/* Step 4 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    4. Red Flags and Referral Criteria
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Emergency Referral:</span> {formData.redFlagEmergency ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Urgent - Under 1 Month:</span> {formData.urgentUnderOneMonth ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Urgent - Eye Involvement:</span> {formData.urgentEyeInvolvement ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Urgent - Immunocompromised:</span> {formData.urgentImmunocompromised ? "Yes" : "No"}</p>

                    <p><span className="font-medium">Referral - Contraindications:</span> {formData.referralContraindications ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Pregnancy:</span> {formData.referralPregnancy ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Spreading Infection:</span> {formData.referralSpreadingInfection ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Not Improving within 14 Days:</span> {formData.referralNotImproving14Days ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Secondary Infection:</span> {formData.referralSecondaryInfection ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Gingivostomatitis:</span> {formData.referralGingivostomatitis ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Erythema Multiforme:</span> {formData.referralErythemaMultiforme ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referral - Hypersensitivity:</span> {formData.referralHypersensitivity ? "Yes" : "No"}</p>

                    <p><span className="font-medium">Limited Supply - Immunocompromised:</span> {formData.limitedSupplyImmunocompromised ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Limited Supply - Recurrent Lesions:</span> {formData.limitedSupplyRecurrentLesions ? "Yes" : "No"}</p>

                    <p><span className="font-medium">Any Red Flag Present:</span> {formData.redFlagPresent || "-"}</p>
                    <p><span className="font-medium">Referral Reason:</span> {formData.referralReason || "-"}</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    5. Review of Symptoms
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Prodromal Phase:</span> {formData.symptomProdromal ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Fluid-filled Blisters:</span> {formData.symptomBlisters ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Swollen / Tender Glands:</span> {formData.symptomTenderGlands ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Gingivostomatitis Symptoms:</span> {formData.symptomGingivostomatitis ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Child - Sore Gums:</span> {formData.childSoreGums ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Child - Sore Throat:</span> {formData.childSoreThroat ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Child - More Saliva:</span> {formData.childMoreSaliva ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Child - High Temperature:</span> {formData.childHighTemperature ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Child - Headaches:</span> {formData.childHeadaches ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Child - Refusal to Drink Fluids:</span> {formData.childRefusalFluids ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Symptoms Typical:</span> {formData.symptomsTypical || "-"}</p>
                    <p><span className="font-medium">Symptoms Referral Reason:</span> {formData.symptomsReferralReason || "-"}</p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    6. Treatment Options
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Meets Inclusion Criteria:</span> {formData.meetsInclusionCriteria ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Proceed With Prescribing:</span> {formData.proceedWithPrescribing ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Advice And Counselling:</span> {formData.adviceAndCounselling ? "Yes" : "No"}</p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    7. Patient Declaration
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Clinical Info Sharing Agreed:</span> {formData.declarationClinicalInfoSharing ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Dispensing Choice Statement Agreed:</span> {formData.declarationDispensingChoice ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Dispense To Another Pharmacy:</span> {formData.dispenseToAnotherPharmacy ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Dispense In This Pharmacy:</span> {formData.dispenseInThisPharmacy ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Consent Signature:</span> {formData.consentSignature || "-"}</p>
                    <p><span className="font-medium">Consent Date:</span> {formData.consentDate || "-"}</p>

                    {isUnder16 && (
                      <p><span className="font-medium">Guardian Consent Signature:</span> {formData.guardianConsentSignature || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Step 8 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    8. Consultation Outcome
                  </h3>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-medium">Referral:</span> {formData.consultationOutcomeReferral ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Self-care:</span> {formData.consultationOutcomeSelfCare ? "Yes" : "No"}</p>
                    <p><span className="font-medium">OTC Product Supplied:</span> {formData.consultationOutcomeOTCProduct ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Prescription for POM Supplied:</span> {formData.consultationOutcomePOMSupplied ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Declined Treatment:</span> {formData.declinedTreatment ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Declined Treatment Reason:</span> {formData.declinedTreatmentReason || "-"}</p>

                    <p><span className="font-medium">Referred to A&E:</span> {formData.referredToAE ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referred to GP:</span> {formData.referredToGP ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Referred to Other:</span> {formData.referredToOther ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Other Referral Details:</span> {formData.referredToOtherDetails || "-"}</p>

                    <p><span className="font-medium">Prescribed Aciclovir 5% Cream:</span> {formData.prescribedAciclovirCream ? "Yes" : "No"}</p>
                  </div>
                </div>

                {/* Step 9 */}
                <div className="rounded-xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    9. Pharmacist Information
                  </h3>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                    <p><span className="font-medium">Pharmacist Name:</span> {formData.pharmacistName || "-"}</p>
                    <p><span className="font-medium">PSI Number:</span> {formData.psiNumber || "-"}</p>
                    <p><span className="font-medium">Pharmacy Address:</span> {formData.pharmacyAddress || "-"}</p>
                    <p><span className="font-medium">Pharmacy Eircode:</span> {formData.pharmacyEircode || "-"}</p>
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
                    onClick={handlePrintConsultation}
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Print
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAndFinish}
                    className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
                  >
                    Save & Finish
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
