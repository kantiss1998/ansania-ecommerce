import { VoucherForm } from "@/components/features/admin/vouchers/VoucherForm";

export default function CreateVoucherPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Buat Voucher Baru
      </h1>
      <VoucherForm />
    </div>
  );
}
