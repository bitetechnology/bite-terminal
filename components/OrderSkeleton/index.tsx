import "../../app/globals.css";

function OrderSkeleton() {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-xl h-72 flex flex-col items-start justify-start border-b-4">
      <div className="flex justify-between items-center w-full mb-2">
        <span
          className="font-medium text-black skeleton"
          style={{ width: "40px", height: "20px" }}
        ></span>
        <div className="flex space-x-3">
          <div
            className="bg-gray-400 p-2 rounded-lg skeleton"
            style={{ width: "24px", height: "24px" }}
          ></div>
          <div
            className="bg-gray-400 p-2 rounded-lg skeleton"
            style={{ width: "24px", height: "24px" }}
          ></div>
        </div>
      </div>
      <div
        className="mt-2 skeleton"
        style={{ width: "100%", height: "60px" }}
      ></div>
    </div>
  );
}

export default OrderSkeleton;
