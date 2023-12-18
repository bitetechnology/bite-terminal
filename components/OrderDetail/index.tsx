import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function OrderDetail({
  deliverect_order,
  orderId,
}: {
  deliverect_order: any;
  orderId: number;
}) {
  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {`Order #${orderId}`}
          </h1>
        </div>
      </div>
      <h2 className="text-sm font-bold leading-7 text-gray-900 sm:truncate ">
        {`Items`}
      </h2>
      {deliverect_order.items.map((item) => {
        return (
          <>
            <div className="flex gap-x-6">
              <div className="flex-auto">
                <div className="flex items-start gap-x-3">
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    {`${item.quantity} ${item.name}`}
                  </div>
                </div>
                {item.subItems.length > 0 &&
                  item.subItems.map((subItem) => {
                    return (
                      <div
                        key={subItem.id}
                        className="pl-4 text-xs font-medium leading-6 text-gray-900"
                      >
                        {`${subItem.quantity} ${subItem.name}`}
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
          </>
        );
      })}
    </>
  );
}
