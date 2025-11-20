import { useSelector, useDispatch } from "react-redux";
import { useGetJobsQuery, useGetTalentsQuery } from "../features/api/poApi";
import {
  removeSection,
  setJobForSection,
  toggleTalent,
  setTalentField,
} from "../features/po/poSlice";

const TalentSection = ({ section, index }) => {
  const dispatch = useDispatch();
  const { formData, isReadOnly } = useSelector((state) => state.po);

  const { data: jobs = [] } = useGetJobsQuery(formData.clientName, {
    skip: !formData.clientName,
  });
  const { data: talents = [] } = useGetTalentsQuery(section.jobId, {
    skip: !section.jobId,
  });

  const handleJobChange = (e) => {
    const jobTitle = e.target.value;
    const job = jobs.find((j) => j.title === jobTitle);
    if (job) {
      dispatch(setJobForSection({ index, jobTitle: job.title, jobId: job.id }));
    }
  };

  const updateField = (talentId, field, value) => {
    dispatch(setTalentField({ sectionIndex: index, talentId, field, value }));
  };

  const labelClass = "form-label small text-secondary fw-bold mb-1";

  // Helper to render Rate + Currency layout
  // This groups the Rate input and Currency select side-by-side within a flexible column
  const renderRateGroup = (
    label,
    rateKey,
    currKey,
    talentId,
    data,
    placeholder
  ) => (
    <div className="col-md-3">
      <div className="row g-1">
        <div className="col-7">
          <label className="small text-muted mb-1">{label}</label>
          <div className="input-group input-group-sm">
            <input
              type="number"
              className="form-control"
              placeholder={placeholder}
              value={data[rateKey]}
              onChange={(e) => updateField(talentId, rateKey, e.target.value)}
              disabled={isReadOnly}
            />
            <span className="input-group-text text-muted bg-white border-start-0">
              /hr
            </span>
          </div>
        </div>
        <div className="col-5">
          <label className="small text-muted mb-1">Currency</label>
          <select
            className="form-select form-select-sm"
            value={data[currKey]}
            onChange={(e) => updateField(talentId, currKey, e.target.value)}
            disabled={isReadOnly}
          >
            <option>USD</option>
            <option>EUR</option>
            <option>INR</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card bg-light mb-4 border-0">
      <div className="card-body pt-4 pb-4">
        {/* Job Header Section */}
        <div className="row g-3 align-items-center mb-3">
          {/* Job Title */}
          <div className="col-md-5">
            <label className={labelClass}>
              Job Title/REQ Name <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={section.jobTitle}
              onChange={handleJobChange}
              disabled={isReadOnly}
            >
              <option value="">Select Job</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.title}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* Job ID */}
          <div className="col-md-6">
            <label className={labelClass}>
              Job ID/REQ ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control bg-white"
              value={section.jobId}
              readOnly
              placeholder="Job ID"
            />
          </div>

           
          <div className="col-md-1 text-end d-flex align-items-end justify-content-end">
            {!isReadOnly && index > 0 && (
              <button
                className="btn btn-link text-secondary p-0"
                style={{ textDecoration: "none" }}
                onClick={() => dispatch(removeSection(index))}
                title="Remove Section"
              >
                <i className="bi bi-trash fs-5"></i>{" "}
                 
                <span className="d-none">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Talents List */}
        {talents.map((talent) => {
          const isSelected = section.selectedTalents.some(
            (t) => t.id === talent.id
          );
          const data =
            section.selectedTalents.find((t) => t.id === talent.id) || {};

          return (
            <div key={talent.id} className="mt-4">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`talent-${talent.id}`}
                  checked={isSelected}
                  onChange={() =>
                    dispatch(toggleTalent({ sectionIndex: index, talent }))
                  }
                  disabled={isReadOnly}
                />
                <label
                  className="form-check-label fw-bold"
                  htmlFor={`talent-${talent.id}`}
                >
                  {talent.name}
                </label>
              </div>

              {isSelected && (
                <div className="row g-3 border-bottom pb-4">
                  {/* 1. Contract Duration */}
                  <div className="col-md-3">
                    <label className="small text-muted mb-1">
                      Contract Duration
                    </label>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contract Duration"
                        value={data.contractDuration}
                        onChange={(e) =>
                          updateField(
                            talent.id,
                            "contractDuration",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      />
                      <span className="input-group-text text-muted bg-none border-start-0">
                        Months
                      </span>
                    </div>
                  </div>

                  {/* 2. Bill Rate Group */}
                  {renderRateGroup(
                    "Bill Rate",
                    "billRate",
                    "billRateCurrency",
                    talent.id,
                    data,
                    "Bill Rate"
                  )}

                  {/* 3. Standard Time Group */}
                  {renderRateGroup(
                    "Standard Time BR",
                    "standardTimeBR",
                    "standardTimeBRCurrency",
                    talent.id,
                    data,
                    "Std. Time BR"
                  )}

                  {/* 4. Over Time Group */}
                  {renderRateGroup(
                    "Over Time BR",
                    "overTimeBR",
                    "overTimeBRCurrency",
                    talent.id,
                    data,
                    "Over Time BR"
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TalentSection;
