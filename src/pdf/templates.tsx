/* eslint-disable @next/next/no-img-element */
// PDF templates, rendered on the server by /api/pdf. They use the Tailwind
// Play CDN loaded by PDF_HEAD, not the app's theme, so brand tokens such as
// bg-surface aren't available here.
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ToWords } from "to-words";
import { Order, Product } from "@/utils/types";
import { siteConfig } from "@/utils/siteConfig";
import { formatAmount } from "@/utils/formatINR";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span>No items</span>;
  }

  return (
    <span>
      {products.map((item: any) => (
        <span key={item.id} className="w-full flex justify-between font-mono tabular-nums">
          <p className="w-64">{item.name}</p>
          <p className="w-24 px-1">{item.count}</p>
          <p className="w-32 px-1">{formatAmount(item.mrp)}</p>
          <p className="w-32 px-1">{formatAmount(item.pretax)}</p>
          <p className="w-32 px-1">{item.tax}</p>
          <p className="w-32 px-1">
            {formatAmount((Number(item.price) - Number(item.pretax)) * item.count)}
          </p>
          <p className="w-32 px-1">{formatAmount(item.price * item.count)}</p>
        </span>
      ))}
    </span>
  );
}

export const InvoiceTemplate = ({ transaction }: { transaction: Order | null }) => {
  const totalPrice =
    transaction?.products.reduce(
      (acc: any, item: any) => acc + item.price * item.count,
      0,
    ) || 0;
  const totalMRP =
    transaction?.products.reduce(
      (acc: any, item: any) => acc + item.mrp * item.count,
      0,
    ) || 0;
  const difference = totalMRP - totalPrice;

  return (
    <div className="h-full flex flex-col justify-between px-6 pt-12 pb-6">
      <div className="">
        <h3 className="font-semibold text-xl">
          Invoice{" "}
          <span className="font-mono tabular-nums">
            {formatInvoiceNo(transaction?.invoice_id, transaction?.created_at)}
          </span>
        </h3>
        <div className="flex flex-row">
          <div className="w-1/2">
            <h5>Sold by</h5>
            <p className="font-semibold text-lg">{siteConfig.legalName}</p>
            <div className="mt-4">
              {siteConfig.registrations.map((registration) => (
                <p key={registration.label}>
                  <span className="font-semibold">{registration.label}:</span>{" "}
                  {registration.value}
                </p>
              ))}
              <p>
                <span className="font-semibold">Phone:</span> {siteConfig.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {siteConfig.email}
              </p>
            </div>
            <p>
              <span className="font-semibold">Address:</span>
              {siteConfig.addressLines.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div className="w-1/2">
            <h5>Customer</h5>
            <p className="font-semibold text-lg">{transaction?.name}</p>
            <p className="mt-4">
              <span className="font-semibold">Phone:</span> {transaction?.phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {transaction?.email}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {transaction?.address}
            </p>
          </div>
        </div>
        <div className="my-6">
          <span className="w-full flex justify-between mb-2">
            <p className="w-64 font-semibold">Name</p>
            <p className="w-24 px-1 font-semibold">Qty</p>
            <p className="w-32 px-1 font-semibold">MRP</p>
            <p className="w-32 px-1 font-semibold">Unit price</p>
            <p className="w-32 px-1 font-semibold">GST %</p>
            <p className="w-32 px-1 font-semibold">GST</p>
            <p className="w-32 px-1 font-semibold">Total</p>
          </span>
          <span className="my-4">
            <OrderItems products={transaction?.products} />
          </span>
          <span className="my-4">
            <p className="mt-4">
              <span className="font-semibold">Item quantity</span>{" "}
              {transaction?.products.reduce(
                (sum: number, num: any) => sum + num.count,
                0,
              )}
            </p>
            <p className="flex justify-between">
              <span>
                <span className="font-semibold">Total: </span>
                <span className="font-mono tabular-nums">Rs. {formatAmount(transaction?.amount)}</span>*{" "}
              </span>
              <span className="text-xl font-semibold">
                You saved <span className="font-mono tabular-nums">Rs. {formatAmount(difference)}</span>
              </span>
            </p>
            <p className="mt-4">
              <span className="font-semibold">Amount in words</span>{" "}
              {transaction?.amount && toWords.convert(transaction?.amount)}
            </p>
          </span>
        </div>
      </div>
      <div>
        <h4 className="w-full text-center">
          Thank you for your order.
        </h4>
        <div className="flex justify-between">
          <p>
            <span className="font-semibold">Transaction ID</span>
            <br />
            <span className="font-mono tabular-nums">{transaction?.transaction_id}</span>
          </p>
          <p>
            <span className="font-semibold">Date and time</span>
            <br />
            {format(
              toZonedTime(transaction?.created_at, "Asia/Kolkata"),
              "HH:mm:ss dd/MM/yyyy",
            )}
          </p>
          <p>
            <span className="font-semibold">Payment</span>
            <br />
            {transaction?.payment_status === "cod"
              ? "Cash on delivery"
              : transaction?.payment_status === "manual"
                ? "Recorded by the shop"
                : "Online"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const OrdersReportTemplate = ({
  ordersList,
  start,
  end,
}: {
  ordersList: Order[];
  start: string;
  end: string;
}) => {
  let totalAmount = 0;
  let totalTax = 0;

  for (const order of ordersList) {
    totalAmount += order.amount;
    totalTax += Array.isArray(order.products)
      ? order.products.reduce(
          (sum: number, item: any) =>
            sum + (Number(item.price) - Number(item.pretax)) * item.count,
          0
        )
      : 0;
  }

  return (
    <div className="h-full px-6">
      <div className="flex justify-between items-center mb-4">
        <span className="flex gap-4 items-center">
          <img
            src={`${siteConfig.websiteUrl}${siteConfig.logoPath}`}
            className="w-12 h-12"
            alt={`${siteConfig.name} logo`}
          />
          <h4 className="font-semibold">
            Sales report, {start} to {end}
          </h4>
        </span>
      </div>
      <div>
        <span className="flex items-start border-2 bg-white py-1 -mb-1">
          <p className="w-36 px-2 font-semibold">Invoice</p>
          <p className="w-44 px-1 font-semibold">Order date</p>
          <p className="w-60 px-1 font-semibold">Customer</p>
          <p className="w-32 px-1 font-semibold">Phone</p>
          <p className="w-24 px-1 font-semibold">Tax</p>
          <p className="w-40 px-1 font-semibold">Amount (Rs.)</p>
        </span>
      </div>
      <div>
        {ordersList && ordersList.length > 0 ? (
          ordersList.map((order: any) => {
            return (
              <span
                key={order.id}
                className="flex items-start border-2 bg-white py-1 -mb-1"
              >
                <p className="w-36 px-2 font-mono tabular-nums">
                  {formatInvoiceNo(order.invoice_id, order.created_at)}
                </p>
                <p className="w-44 px-1">
                  {format(
                    toZonedTime(order.created_at, "Asia/Kolkata"),
                    "dd-MM-yyyy"
                  )}
                </p>
                <p className="w-60 px-1">{order.name}</p>
                <p className="w-32 px-1">{order.phone}</p>
                <p className="w-24 px-1 font-mono tabular-nums">
                  {formatAmount(
                    order.products.reduce(
                      (sum: number, item: any) =>
                        sum +
                        (Number(item.price) - Number(item.pretax)) * item.count,
                      0
                    ),
                  )}
                </p>
                <p className="w-40 px-1 font-mono tabular-nums">{formatAmount(order.amount)}</p>
              </span>
            );
          })
        ) : (
          <span className="flex items-start border-2 bg-white py-1 -mb-1">
            <p>No orders available</p>
          </span>
        )}
      </div>
      <div>
        <span className="flex items-start border-2 bg-white py-1 mt-4">
          <p className="w-36 px-2 font-semibold">Total</p>
          <p className="w-44 px-1"></p>
          <p className="w-60 px-1"></p>
          <p className="w-32 px-1"></p>
          <p className="w-24 px-1 font-mono tabular-nums">{formatAmount(totalTax)}</p>
          <p className="w-40 px-1 font-mono tabular-nums">{formatAmount(totalAmount)}</p>
        </span>
      </div>
    </div>
  );
};

export const ProductsListTemplate = ({ products }: { products: Product[] }) => {
  return (
    <div className="h-full px-6">
      <div className="flex justify-between items-center mb-4">
        <span className="flex gap-4 items-center">
          <img
            src={`${siteConfig.websiteUrl}${siteConfig.logoPath}`}
            className="w-12 h-12"
            alt={`${siteConfig.name} logo`}
          />
          <p className="font-semibold">{siteConfig.name}</p>
        </span>
        <p>Mob: {siteConfig.phone}</p>
      </div>
      <div>
        <div className="flex">
          <span className="w-12 border-2 px-1 font-semibold">ID</span>
          <span className="w-72 border-2 px-1 font-semibold">Name</span>
          <span className="w-40 border-2 px-1 font-semibold">Category</span>
          <span className="w-40 border-2 px-1 font-semibold">Price</span>
        </div>
        {products &&
          products.map((product: Product) => (
            <div key={product?.id} className="flex">
              <span className="w-12 border-2 px-1">{product.id}</span>
              <span className="w-72 border-2 px-1">{product.name}</span>
              <span className="w-40 border-2 px-1">{product.category}</span>
              <span className="w-40 border-2 px-1 font-mono tabular-nums">Rs. {formatAmount(product.price)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
