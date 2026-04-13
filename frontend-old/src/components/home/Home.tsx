import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import styles from "./Home.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { fetchAllInvestments } from "../../features/auth/addInvestmentSlice";
import CircleLoader from "../common/CircleLoader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state: RootState) => state.investment);

  useEffect(() => {
    dispatch(fetchAllInvestments());
  }, [dispatch]);

  // ✅ Group data by month-year
  const groupedByMonth: Record<string, any[]> = {};
  list.forEach((item) => {
    const d = new Date(item.date);
    const monthKey = d.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. "Mar 2026"
    if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
    groupedByMonth[monthKey].push(item);
  });

  // ✅ Build chart configs per month
  const charts = Object.entries(groupedByMonth).map(([month, items]) => {
    const grouped: Record<string, Record<string, number>> = {};
    items.forEach((item) => {
      const dateKey = new Date(item.date).toLocaleDateString("en-GB");
      if (!grouped[dateKey]) grouped[dateKey] = {};
      if (!grouped[dateKey][item.toInvestment]) grouped[dateKey][item.toInvestment] = 0;
      grouped[dateKey][item.toInvestment] += item.amount ?? 0;
    });

    const labels = Object.keys(grouped);
    const categories = Array.from(new Set(items.map((i) => i.toInvestment)));

    const datasets = categories.map((cat, idx) => ({
      label: cat,
      data: labels.map((date) => grouped[date][cat] || 0),
      backgroundColor: `rgba(${50 + idx * 40}, ${100 + idx * 30}, ${150 - idx * 20}, 0.6)`,
      borderColor: `rgba(${50 + idx * 40}, ${100 + idx * 30}, ${150 - idx * 20}, 1)`,
      borderWidth: 1,
    }));

    return {
      month,
      chartData: { labels, datasets },
    };
  });

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Investments & Expenses by Date and Category",
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Amount (₹)" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Monthly Expanses Charts</div>
      {loading && <p><CircleLoader /></p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {/* ✅ Render one chart per month */}
      {charts.map(({ month, chartData }) => (
        <div key={month} className={styles.chartWrapper}>
          <div className={styles.chartTitle}>{month}</div>
          <Bar data={chartData} options={options} />
        </div>
      ))}
    </div>
  );
};

export default Home;