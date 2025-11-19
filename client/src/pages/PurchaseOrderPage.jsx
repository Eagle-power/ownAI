import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // 1. IMPORT useNavigate
import { useCreatePOMutation, useGetPOByIdQuery } from "../features/api/poApi";
import {
  addSection,
  resetForm,
  setReadOnly,
  setAllFormData,
} from "../features/po/poSlice";
import HeaderSection from "../components/HeaderSection";
import TalentSection from "../components/TalentSection";

const PurchaseOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. INITIALIZE navigate
  const { id } = useParams();

  // Fetch Data if ID exists
  const { data: existingPO, isLoading: isFetching } = useGetPOByIdQuery(id, {
    skip: !id,
  });

  const { formData, isReadOnly } = useSelector((state) => state.po);
  const [createPO, { isLoading: isSaving }] = useCreatePOMutation();
  const [errors, setErrors] = useState({});

  // Sync Data to Redux when it arrives
  useEffect(() => {
    if (existingPO) {
      dispatch(setAllFormData(existingPO));
    }
  }, [existingPO, dispatch]);

  const validate = () => {
    // ... (Keep your existing validation logic) ...
    // For brevity, assuming validation logic is here
    let tempErrors = {};
    if (!formData.clientName) tempErrors.clientName = "Required";
    if (!formData.poType) tempErrors.poType = "Required";
    if (!formData.poNo) tempErrors.poNo = "Required";
    if (!formData.budget) tempErrors.budget = "Required";

    // Talent check
    let totalTalents = 0;
    formData.talentsDetails.forEach(
      (s) => (totalTalents += s.selectedTalents.length)
    );
    if (formData.poType === "Individual PO" && totalTalents === 0)
      tempErrors.talents = "Select a talent";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        // 3. CAPTURE THE BACKEND RESPONSE
        const result = await createPO(formData).unwrap();

        alert("Purchase Order Saved!");

        // 4. NAVIGATE TO THE URL WITH THE NEW ID
        // Assuming 'result._id' is the ID from MongoDB.
        // If your backend returns 'id', change it to result.id
        navigate(`/purchase-order/${result._id}`);

        dispatch(setReadOnly(true));
        setErrors({});
      } catch (err) {
        console.error(err);
        alert("Failed to save: " + (err.data?.message || "Unknown error"));
      }
    } else {
      alert("Please fix the errors highlighted in red.");
    }
  };

  if (isFetching) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4 mb-5">
      {/* ... Keep your existing JSX ... */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          {/* Show ID if available */}
          <h4 className="mb-0 text-danger">
            &lt; Purchase Order | {id ? `View (${id})` : "New"}
          </h4>
        </div>
        <div className="card-body">
          <HeaderSection errors={errors} />
          <hr />
          {/* ... Talent Section & Buttons ... */}
          {formData.talentsDetails.map((section, index) => (
            <TalentSection
              key={section.sectionId || index}
              section={section}
              index={index}
            />
          ))}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => dispatch(resetForm())}
            >
              Reset
            </button>
            {!isReadOnly && (
              <button
                className="btn btn-secondary"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;
