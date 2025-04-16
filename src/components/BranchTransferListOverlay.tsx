"use client";
import { CloseRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useGenerateCheckoutList } from "@/app/hooks/checkouts/useGenerateCheckoutList";
import emptyImg from "../../public/assets/images/empty.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BranchCheckoutOverlayProps,
  GenerateCheckoutListRequestInterface,
} from "@/types/CheckoutInterface";
import { toast } from "react-toastify";
import Dropdown from "@/components/Dropdown";

const BranchCheckoutListOverlay: React.FC<BranchCheckoutOverlayProps> = ({
  onOverlayClose,
  checkoutList,
  branchList,
  onUpdateCheckoutList,
}) => {
  const [branch, setBranch] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });
  const [remarks, setRemarks] = useState<string | null>(null);
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [isDataUnVerified, setIsDataUnVerified] = useState(true);
  const [editedItem, setEditedItem] = useState<{
    quantity?: number;
    specificDate?: string;
  }>({});
  const [openDropdown, setOpenDropdown] = useState(false);
  const router = useRouter();
  const generateCheckoutListMutation = useGenerateCheckoutList();

  var CheckoutCompanyId = checkoutList[0]?.CompanyId;
  var CheckoutBranchId = checkoutList[0]?.BranchId;

  branchList =
    branchList?.filter((branch) => branch.Id !== CheckoutBranchId) || [];

  useEffect(() => {
    const allQuantitiesValid = checkoutList.every(
      (item) => (item.Quantity || 0) > 0
    );
    setIsDataUnVerified(!allQuantitiesValid);
  }, [checkoutList]);

  const handlelSpecificDateSelect = (value: string) => {
    let formattedValue = value.replace(/[^\d-]/g, "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
      setEditedItem((prev) => ({
        ...prev,
        specificDate: formattedValue,
      }));
    } else {
      if (formattedValue.length > 4 && formattedValue[4] !== "-") {
        formattedValue =
          formattedValue.slice(0, 4) + "-" + formattedValue.slice(4);
      }
      if (formattedValue.length > 7 && formattedValue[7] !== "-") {
        formattedValue =
          formattedValue.slice(0, 7) + "-" + formattedValue.slice(7);
      }
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }

      setEditedItem((prev) => ({
        ...prev,
        specificDate: formattedValue,
      }));
    }
  };

  const handleRemoveFromCheckout = (
    id: string,
    companyId: string,
    branchId: string,
    containerId: string
  ) => {
    const updatedCheckoutList = checkoutList.filter(
      (item) =>
        !(
          item.Id === id &&
          item.CompanyId === companyId &&
          item.BranchId === branchId &&
          item.ContainerId === containerId
        )
    );
    onUpdateCheckoutList(updatedCheckoutList);
  };

  const handleSaveEdit = (
    id: string,
    companyId: string,
    branchId: string,
    containerId: string
  ) => {
    if ((editedItem.quantity || 0) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const targetItem = checkoutList.find(
      (item) =>
        item.Id === id &&
        item.CompanyId === companyId &&
        item.BranchId === branchId &&
        item.ContainerId === containerId
    );

    if (
      targetItem &&
      targetItem.AvailableQuantity !== undefined &&
      (editedItem.quantity || 0) > targetItem.AvailableQuantity
    ) {
      toast.error("Quantity cannot be greater than available quantity.");
      return;
    }

    const updatedCheckoutList = checkoutList.map((item) => {
      if (
        item.Id === id &&
        item.CompanyId === companyId &&
        item.BranchId === branchId &&
        item.ContainerId === containerId
      ) {
        return {
          ...item,
          Quantity: editedItem.quantity || 0,
          SpecificExpiryDate:
            editedItem.specificDate || item.SpecificExpiryDate,
        };
      }
      return item;
    });

    onUpdateCheckoutList(updatedCheckoutList);
    setEditableIndex(null);
  };

  const handleGenerateCheckoutList = async () => {
    if (checkoutList.length === 0) {
      toast.error("Checkout list is empty.");
      return;
    }

    const isValidQuantity = checkoutList.every(
      (item) => item.Quantity && item.Quantity > 0
    );

    if (!isValidQuantity) {
      toast.error("Each item must have a quantity greater than 0.");
      return;
    }

    const DescriptionDetails = checkoutList.map((item) => ({
      DescriptionId: item.Id,
      Quantity: item.Quantity,
      SpecificExpiryDate: item.SpecificExpiryDate,
      ContainerId: item.ContainerId,
    }));

    const CheckoutPayload: GenerateCheckoutListRequestInterface = {
      DescriptionDetails,
      BranchId: branch.id,
      Remarks: remarks!,
      CheckoutBranchId: CheckoutBranchId,
      CheckoutCompanyId: CheckoutCompanyId,
    };

    try {
      const response = await generateCheckoutListMutation.mutateAsync(
        CheckoutPayload
      );

      if (response.result) {
        handleClearAll();
        router.push(`/checkout/${response.result}`);
      } else {
        toast.error(response.error);
        router.push(`/checkout`);
      }
    } catch (error) {
      console.error("Failed to generate checkout list", error);
    }
  };

  const handleClearAll = () => {
    onUpdateCheckoutList([]);
  };

  const handleBranchSelect = (selectedBranch: { id: string; name: string }) => {
    setBranch(selectedBranch);
    setOpenDropdown(false);
  };

  return (
    <>
      <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20" />
      <div className="fixed w-2/3 md:w-2/3 p-6 top-10 right-1/2 translate-x-2/3 text-xs md:text-sm bg-white text-text rounded-3xl z-40 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg mb-2 flex-1 text-center">
            Checkout Items
          </h3>
          <button className="text-error" onClick={onOverlayClose}>
            <CloseRounded />
          </button>
        </div>

        {checkoutList.length ? (
          <div className="tableDiv">
            <table className="w-full outline outline-grey text-center rounded-lg">
              <thead className="bg-white text-black">
                <tr>
                  <th className="lg:px-2">SNo</th>
                  <th className="lg:px-2">Short Name</th>
                  <th className="lg:px-2">Pack Size</th>
                  <th className="lg:px-2">Available Quantity</th>
                  <th className="lg:px-2">Quantity</th>
                  <th className="lg:px-2">Specific Date</th>
                  <th className="text-right"> Actions</th>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <hr className="border-tablehead my-1" />
                  </td>
                </tr>
              </thead>
              <tbody>
                {checkoutList.map((item, index) => (
                  <>
                    <tr key={index} className="my-2">
                      <td className="lg:px-2">{index + 1}</td>
                      <td
                        className="lg:px-2 text-center truncate"
                        title={item.ShortName || item.Description}
                      >
                        {item.ShortName ? item.ShortName : item.Description}
                      </td>
                      <td
                        className="lg:px-2 text-center truncate"
                        title={item.PackSize}
                      >
                        {item.PackSize}
                      </td>
                      <td className="lg:px-2 text-center">
                        {item.AvailableQuantity}
                      </td>
                      <td className="lg:px-2 text-center">
                        {editableIndex === index ? (
                          <input
                            type="number"
                            value={editedItem.quantity}
                            onChange={(e) =>
                              setEditedItem((prev) => ({
                                ...prev,
                                quantity: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              }))
                            }
                            className="border rounded p-1 w-20"
                            onFocus={(e) => e.target.select()}
                          />
                        ) : (
                          item.Quantity
                        )}
                      </td>
                      <td className="lg:px-2 text-center">
                        {editableIndex === index ? (
                          <input
                            type="text"
                            value={editedItem.specificDate || ""}
                            placeholder="YYYY/MM/DD"
                            onChange={(e) =>
                              handlelSpecificDateSelect(e.target.value)
                            }
                            className="border rounded p-1"
                            onFocus={(e) => e.target.select()}
                          />
                        ) : (
                          item.SpecificExpiryDate
                        )}
                      </td>
                      <td className="">
                        {editableIndex === index ? (
                          <button
                            className="text-success"
                            title="Save item"
                            onClick={() =>
                              handleSaveEdit(
                                item.Id,
                                item.CompanyId,
                                item.BranchId,
                                item.ContainerId
                              )
                            }
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="flex w-full justify-center text-error"
                            title="Edit item"
                            onClick={() => {
                              setEditableIndex(index);
                              setEditedItem({
                                quantity: item.Quantity || undefined,
                                specificDate:
                                  item.SpecificExpiryDate || undefined,
                              });
                            }}
                          >
                            <EditRounded
                              style={{ color: "green" }}
                              className="hover:text-errorAccent"
                            />
                          </button>
                        )}
                      </td>
                      <td className="">
                        <button
                          className="flex items-center text-error"
                          title="Remove item from checkout"
                          onClick={() =>
                            handleRemoveFromCheckout(
                              item.Id,
                              item.CompanyId,
                              item.BranchId,
                              item.ContainerId
                            )
                          }
                        >
                          <DeleteRounded className="hover:text-errorAccent" />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={8}>
                        <hr className="border-tablehead" />
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <div className="primaryTransferee flex items-center gap-2 w-full my-4">
              <Dropdown
                label="Branch"
                showLabel={false}
                options={
                  branchList?.map((branch) => ({
                    id: branch.Id,
                    name: branch.Name,
                  })) || []
                }
                isOpen={openDropdown}
                setIsOpen={() => setOpenDropdown(!openDropdown)}
                required
                value={branch.name || "Select a branch to transfer to"}
                onSelect={handleBranchSelect}
                placeholder="Select a branch to transfer to"
                disabled={isDataUnVerified}
              />
            </div>
            <textarea
              placeholder="Remarks"
              className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-grey focus:outline-primary focus:ring-0 focus:outline-none scrollbar-thin"
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isDataUnVerified}
            />
            <div className="flex justify-end">
              <button
                className="bg-success hover:opacity-80 disabled:border disabled:bg-transparent disabled:border-grey disabled:opacity-40 disabled:text-primary text-white rounded-3xl px-4 py-2"
                disabled={!checkoutList.length || !branch.id}
                onClick={handleGenerateCheckoutList}
              >
                Generate Checkout List
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="h-32 w-32 mx-auto">
              <Image
                src={emptyImg}
                alt="Empty Checkout List"
                priority={true}
                className="mx-auto h-auto"
              />
            </div>
            <h1 className="font-bold text-error">Checkout list is empty</h1>
            <h1 className="text-text">
              Please add items to proceed with the checkout!
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default BranchCheckoutListOverlay;
