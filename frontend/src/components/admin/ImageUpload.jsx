import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { formatApiError, imgSrc, uploadImage } from "@/lib/api";

export default function ImageUpload({ value, onChange, testid }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5MB");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Foto berhasil diunggah");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... atau unggah foto"
          className="min-w-0 flex-1 rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          data-testid={testid}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-navy/90 disabled:opacity-60"
          data-testid={`${testid}-upload-btn`}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Mengunggah" : "Unggah"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFile}
        data-testid={`${testid}-file-input`}
      />
      {value && (
        <img
          src={imgSrc(value)}
          alt="Pratinjau"
          className="mt-2 h-28 w-full rounded-xl object-cover"
          data-testid={`${testid}-preview`}
        />
      )}
    </div>
  );
}
