import { useSelector, useDispatch } from "react-redux";
import { setField } from "../features/po/poSlice";
import { useGetClientsQuery } from "../features/api/poApi";

const HeaderSection = ({ errors }) => {
  const dispatch = useDispatch();
  const { formData, isReadOnly } = useSelector((state) => state.po);
  const { data: clients = [] } = useGetClientsQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setField({ name, value }));
  };

  // Helper class for consistent label styling
  const labelClass = "form-label small text-secondary fw-bold mb-1";

  return (
    <div className="card border-0 mb-4">
      <div className="card-body p-0">
        <div className="d-flex flex-column gap-3">
          {/* ROW 1: Client, Type, PO No, Received On (4 items) */}
          <div className="row g-2">
            {/* 1. Client Name */}
            <div className="col-md-3">
              <label className={labelClass}>
                Client Name <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${
                  errors.clientName && "is-invalid"
                }`}
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. PO Type */}
            <div className="col-md-3">
              <label className={labelClass}>
                Purchase Order Type <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${
                  errors.poType && "is-invalid"
                }`}
                name="poType"
                value={formData.poType}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="">Select</option>
                <option value="Group PO">Group PO</option>
                <option value="Individual PO">Individual PO</option>
              </select>
            </div>

            {/* 3. PO No */}
            <div className="col-md-3">
              <label className={labelClass}>
                Purchase Order No <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${
                  errors.poNo && "is-invalid"
                }`}
                placeholder="PO Number"
                name="poNo"
                value={formData.poNo}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            {/* 4. Received On */}
            <div className="col-md-3">
              <label className={labelClass}>
                Received On <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                name="receivedOn"
                value={formData.receivedOn}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* ROW 2: Rec Name, Rec Email, Start, End, Budget, Curr (6 items) */}
          <div className="row g-2">
            {/* 1. Received From Name */}
            <div className="col-md-2">
              <label className={labelClass}>
                Received From <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Received From Name"
                name="receivedFromName"
                value={formData.receivedFromName}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            {/* 2. Received From Email */}
            <div className="col-md-2">
              <label className={labelClass}>&nbsp;</label>{" "}
              {/* Spacer to align input */}
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Received From Email ID"
                name="receivedFromEmail"
                value={formData.receivedFromEmail}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            {/* 3. Start Date */}
            <div className="col-md-2">
              <label className={labelClass}>
                PO Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control form-control-sm ${
                  errors.poStartDate && "is-invalid"
                }`}
                name="poStartDate"
                value={formData.poStartDate}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            {/* 4. End Date */}
            <div className="col-md-2">
              <label className={labelClass}>
                PO End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control form-control-sm ${
                  errors.poEndDate && "is-invalid"
                }`}
                name="poEndDate"
                value={formData.poEndDate}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            {/* 5. Budget */}
            <div className="col-md-2">
              <label className={labelClass}>
                Budget <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control form-control-sm ${
                  errors.budget && "is-invalid"
                }`}
                placeholder="Budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            {/* 6. Currency */}
            <div className="col-md-2">
              <label className={labelClass}>
                Currency <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-select-sm"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="USD">USD - Dollars ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="INR">INR - Rupee (₹)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
