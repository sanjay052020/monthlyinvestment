import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddInvestmentForm from "./AddInvestmentForm";
import InvestmentTable from "./InvestmentTable";
import ReportGenerator from "../reportgenerate/ReportGenerator";
import Home from "../home/Home";
import Navbar from "../navbar/Navbar";
import ExcelSheet from "../excel/ExcelSheet";
import AmountCalculator from "../calculator/AmountCalculator";
import UserContactForm from "../contacts/UserContactForm";
import UserContactList from "../contacts/UserContactList";
import { BillingForm } from "../billing/BillingForm";
import BillingTable from "../billing/BillingTable";

const Dashboard: React.FC = () => {
  const [activeContent, setActiveContent] = useState<string>("Home");
  const showBackground = activeContent !== "Home";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh", // ✅ ensures full page coverage
        width: "100%",      // ✅ covers full width
        backgroundImage: showBackground
          ? "url('/images/Monthlyexpensesbac.png')"
          : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // ✅ keeps image fixed while scrolling
      }}
    >
      {/* Sidebar */}
      <Sidebar setActiveContent={setActiveContent} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* ✅ Navbar sits at the top of the right side */}
        <Navbar avatarUrl="/images/photo-latest.jpg" />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "2rem",
            borderRadius: "8px",
            margin: "1rem",
            overflowY: "auto",
          }}
        >
          {activeContent === "Home" && <Home />}
          {activeContent === "EnterExpenses" && <AddInvestmentForm />}
          {activeContent === "ViewMonthly" && <InvestmentTable statusFilter="completed" />}
          {activeContent === "ViewYearly" && <h2>📊 Yearly Expenses Report</h2>}
          {activeContent === "ReportGenerate" && <ReportGenerator />}
          {activeContent === "excel" && <h2><ExcelSheet /></h2>}
          {activeContent === "calculator" && <h2><AmountCalculator /></h2>}
          {activeContent === "Settings" && <h2>⚙️ Settings Overview</h2>}
          {activeContent === "userdetails" && <h2><UserContactList /></h2>}
          {activeContent === "enterusers" && <h2><UserContactForm /></h2>}
          {activeContent === "url" && <h2>💬 Url Section</h2>}
          {activeContent === "Updates" && <h2>🔔 Updates Section</h2>}
          {activeContent === "createbills" && <h2><BillingForm /></h2>}
          {activeContent === "showtransaction" && <h2><BillingTable /></h2>}
          {activeContent === "Support" && <h2>🛟 Support Section</h2>}
          {activeContent === "todo" && <InvestmentTable statusFilter="pending" />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;