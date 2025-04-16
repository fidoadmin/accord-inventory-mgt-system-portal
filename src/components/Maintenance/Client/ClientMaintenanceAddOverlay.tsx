import { AddOrUpdateClientPayloadInterface } from "@/types/ClientInterface";
import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";

import { useState, FormEvent } from "react";
import { useAddOrUpdateClientMaintenance } from "@/app/hooks/client/useClientAddOrUpdate";

const ClientAddOverlay = ({
  onOverlayClose,
  onSuccess,
}: {
  onOverlayClose: () => void;
  onSuccess: (newClient?: any) => void;
}) => {
  const [authKey, setAuthKey] = useState<string | null>(null);

  const { mutateAsync: addOrUpdateClient } = useAddOrUpdateClientMaintenance();

  const initialClientData: AddOrUpdateClientPayloadInterface = {
    Id: "",
    Name: "",
  };

  const [descAddData, setDescAddData] = useState(initialClientData);

  useState(() => {
    const key = localStorage.getItem("authKey") as string;
    setAuthKey(key);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDescAddData({ ...descAddData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!descAddData.Name) {
      toast.error("Name is required.", { position: "top-right" });
      return;
    }

    try {
      await addOrUpdateClient(descAddData);
      onSuccess(descAddData);
      onOverlayClose();
    } catch (error) {}
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20">
      <div
        className="fixed w-1/2 min-h-52 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="titleDiv">
          <h1 className="text-lg text-primary text-center font-bold">
            Add Client
          </h1>
        </div>

        <div>
          <p className="text-text text-sm">
            Name: <span className="text-error">*</span>
          </p>
          <input
            name="Name"
            value={descAddData.Name || ""}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-4 justify-center mt-5">
          <button
            className="bg-success rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={handleSubmit}
          >
            <SaveRounded /> Save
          </button>
          <button
            className="bg-error rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={onOverlayClose}
          >
            <CancelRounded /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientAddOverlay;
