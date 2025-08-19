import { useTranslation } from "next-i18next";

const RercentBooking = () => {
  const { t } = useTranslation("common");
  
  const data = [
    {
      item: t("dashboard.newYork"),
      description: t("dashboard.discoverAmerica"),
      total: "$130",
      paid: "$0",
      status: { color: "yellow-4", text: "yellow-3", label: t("dashboard.pending") },
      createdAt: "04/04/2022 08:16",
    },
    {
      item: t("dashboard.newYork"),
      description: t("dashboard.discoverAmerica"),
      total: "$130",
      paid: "$0",
      status: { color: "blue-1-05", text: "blue-1", label: t("dashboard.confirmed") },
      createdAt: "04/04/2022 08:16",
    },
    {
      item: t("dashboard.newYork"),
      description: t("dashboard.discoverAmerica"),
      total: "$130",
      paid: "$0",
      status: { color: "red-3", text: "red-2", label: t("dashboard.rejected") },
      createdAt: "04/04/2022 08:16",
    },
    {
      item: t("dashboard.newYork"),
      description: t("dashboard.discoverAmerica"),
      total: "$130",
      paid: "$0",
      status: { color: "blue-1-05", text: "blue-1", label: t("dashboard.confirmed") },
      createdAt: "04/04/2022 08:16",
    },
    {
      item: t("dashboard.newYork"),
      description: t("dashboard.discoverAmerica"),
      total: "$130",
      paid: "$0",
      status: { color: "blue-1-05", text: "blue-1", label: t("dashboard.confirmed") },
      createdAt: "04/04/2022 08:16",
    },
  ];
  
  return (
    <div className="overflow-scroll scroll-bar-1 pt-30">
      <table className="table-2 col-12">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("dashboard.item")}</th>
            <th>{t("dashboard.total")}</th>
            <th>{t("dashboard.paid")}</th>
            <th>{t("dashboard.status")}</th>
            <th>{t("dashboard.createdAt")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {row.item}
                <br /> {row.description}
              </td>
              <td className="fw-500">{row.total}</td>
              <td>{row.paid}</td>
              <td>
                <div
                  className={`rounded-100 py-4 text-center col-12 text-14 fw-500 bg-${row.status.color} text-${row.status.text}`}
                >
                  {row.status.label}
                </div>
              </td>
              <td>{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RercentBooking;
