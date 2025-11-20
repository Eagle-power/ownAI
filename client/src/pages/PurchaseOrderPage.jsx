import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
        const result = await createPO(formData).unwrap();

        alert("Purchase Order Saved!");

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
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-danger">
            &lt; Purchase Order | {id ? `View (${id})` : "New"}
          </h4>
        </div>
        <div className="card-body">
          <HeaderSection errors={errors} />
          <hr />

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
              onClick={() => {
                dispatch(resetForm()); // Clear Redux form
                dispatch(setReadOnly(false)); // Make form editable
                localStorage.clear(); // Clear saved data
                navigate("/purchase-order"); // Redirect to new PO form
              }}
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
