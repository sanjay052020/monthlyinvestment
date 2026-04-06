import React, { useEffect, useState } from "react";
import "./BillingTable.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { Bill, fetchBills } from "../../features/billing/billingSlice";
import CircleLoader from "../common/CircleLoader";
import BillingRecord from "./BillingRecord";
import { filterBills } from "../../utils/billUtils";
import { handleDelete, handleSave } from "../../utils/billActions";
import Popup from "../common/Popup";

const BillingTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bills, loading, error } = useAppSelector((state: RootState) => state.billing);

  const [searchId, setSearchId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  if (loading) return <CircleLoader />;
  if (error) return <p className="error">{error}</p>;

  const filteredBills = filterBills(bills, searchId, searchDate);

  // ✅ Wrap common handlers for child props
  const onDelete = async (billing_id: string) => {
    await handleDelete(dispatch, billing_id, () => {
      setPopupMessage("Bill deleted successfully ✅");
    });
  };

  const onSave = async (updatedBill: Bill) => {
    await handleSave(dispatch, updatedBill.billing_id, updatedBill, () => {
      setPopupMessage("Bill updated successfully ✅");
    });
  };

  return (
    <div className="billing-card">
      <div className="card-header">
        <fieldset className="inputGroupWrapper">
          <legend className="groupLegend">Search Input</legend>
          <div className="search-bar-Billing">
            <input
              type="text"
              placeholder="Search by Bill ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
        </fieldset>
      </div>

      {popupMessage && <Popup message={popupMessage} onClose={()=>setPopupMessage("")} />}

      {filteredBills.length === 0 ? (
        <p className="no-results">No records found.</p>
      ) : (
        filteredBills.map((bill: Bill) => (
          <BillingRecord
            key={bill.billing_id}
            bill={bill}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default BillingTable;