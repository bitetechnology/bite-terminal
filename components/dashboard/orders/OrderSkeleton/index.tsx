import "../../app/globals.css";

function OrderSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col items-center p-10"
      style={{
        backgroundColor: "#F5F7F9",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        width: "100%",
        margin: "0 auto",
        padding: "0 auto",
      }}
    >
      <div className="w-full mt-10 flex flex-col items-center">
        {/* Skeleton for orders */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="card mb-10 flex flex-col w-[70vw] rounded-lg shadow-2xl bg-gray-200 animate-pulse"
          >
            <div className="card mb-10 flex flex-col w-[70vw] rounded-lg shadow-2xl bg-gray-200 animate-pulse">
              {/* Skeleton for order header */}
              <div className="flex justify-between items-center w-full bg-transparent border-b border-gray-300 pb-2 p-3">
                <span className="font-black text-xl">
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 ml-4 rounded-full bg-green-500 w-24 h-5"></span>
                </span>
                <div className="space-x-2 mt-1 mb-1 flex flex-wrap">
                  <div className="bg-red-400 w-20 h-5 rounded"></div>
                  <div className="bg-yellow-400 w-32 h-5 rounded"></div>
                  <div className="bg-green-400 w-40 h-5 rounded"></div>
                </div>
              </div>

              {/* Skeleton for table */}
              <table className="min-w-full divide-y divide-[rgb(229,231,235)] w-full rounded-lg rounded-2xl ">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {[...Array(4)].map((_, colIndex) => (
                      <th
                        key={colIndex}
                        scope="col"
                        className="px-4 py-2 text-left text-md"
                      >
                        <div className="bg-white w-24 h-4 rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[rgb(229,231,235)]">
                  {[...Array(3)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...Array(4)].map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-5 text-md">
                          <div className="bg-gray-300 w-full h-4 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-gray-200">
                    <td colSpan={4} className="px-4 py-2 text-right text-md">
                      <div className="bg-gray-300 w-24 h-4 rounded mr-4"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderSkeleton;
