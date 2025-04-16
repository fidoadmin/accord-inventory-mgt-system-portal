import React, { useEffect, useState } from "react";
import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveRounded,
} from "@mui/icons-material";

import SearchInput from "@/components/SearchBox";
import { toast } from "react-toastify";
import { useClientList } from "@/app/hooks/client/useClientList";
import {
  AddOrUpdateClientPayloadInterface,
  ClientDetailInterface,
} from "@/types/ClientInterface";
import { useAddOrUpdateClientMaintenance } from "@/app/hooks/client/useClientAddOrUpdate";
import Pagination from "@/components/Pagination";
import ClientAddOverlay from "./ClientMaintenanceAddOverlay";
import { SidebarSectionInterface } from "@/types/ComponentInterface";
import { getCookie } from "cookies-next";
import { useDeleteClientMaintenance } from "@/app/hooks/client/useClientDelete";

function ClientMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;

  const [addbutton, setAddButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editableClient, setEditableClient] =
    useState<ClientDetailInterface | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarSectionInterface[] | null>(
    null
  );

  const [clients, setClients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { mutate: addOrUpdateClient } = useAddOrUpdateClientMaintenance();
  const { mutate: deleteClient } = useDeleteClientMaintenance();

  const {
    data: clientList,
    error: clientError,
    isLoading: clientLoading,
  } = useClientList(authKey || "", {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });
  useEffect(() => {
    const menuItemsFromStorage = localStorage.getItem("menuItems");
    if (menuItemsFromStorage) {
      try {
        const parsedMenuItems = JSON.parse(menuItemsFromStorage);
        setMenuItems(parsedMenuItems);
      } catch (error) {
        console.error("Failed to parse menuItems from localStorage:", error);
      }
    }
  }, []);
  const accessDetails = menuItems?.flatMap((menu) => {
    if (menu.Name === "Maintenance") {
      return menu.SideBarDropdowns?.flatMap((child) => {
        if (child.Name === "Organization" && child.PageDropdowns) {
          return child.PageDropdowns.filter(
            (dropdown) => dropdown.Name === "Client"
          );
        }
        return [];
      });
    }
    return [];
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const totalCount = clientList?.totalCount || 0;
  const data = clientList?.data || [];

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalCount / itemsPerPage)
  );

  const handleEditClient = (clientId: string, client: any) => {
    setEditingClientId(clientId);
    setEditableClient({ ...client });
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSaveClient = async () => {
    if (editableClient) {
      const payload: AddOrUpdateClientPayloadInterface = {
        Id: editingClientId || "",
        Name: editableClient?.Name,
      };

      try {
        await addOrUpdateClient(payload);
        setEditingClientId(null);
        setEditableClient(null);
        setSortBy("modified");
        setSortOrder("desc");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Error updating client: ${error.message}`);
        } else {
          toast.error("Unknown error updating client.");
        }
      }
    }
  };

  const handleDeleteManufacturer = (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p className="text-white">
          Are you sure you want to delete this Client?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteClient({
                  Id: id,
                  AuthKey: authKey || "",
                });

                setClients((prevCompany) =>
                  prevCompany.filter((company) => company.Id !== id)
                );
                closeToast();
              } catch (error: any) {
                toast.error("Failed to delete manufacturer", {
                  position: "top-right",
                });
                closeToast();
              }
            }}
            className="px-3 py-1.5 bg-error text-white rounded-md hover:bg-error"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const handleCancelClient = () => {
    setEditingClientId(null);
    setEditableClient(null);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };
  const handelSuccess = async (newClient: any) => {
    if (newClient) {
      setClients((prevClients) => [newClient, ...prevClients]);
      setSortBy("created");
      setSortOrder("desc");
    }
  };
  return (
    <>
      <div className="w-full px-8 mt-4">
        <div className="flex items-center gap-4 mt-[-56px] pl-48">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="relative w-full">
          <div className="py-1 flex justify-end mb-2">
            {accessDetails && accessDetails[0]?.CanCreate === "1" && (
              <button
                className="btn bg-success rounded-xl px-4 py-2 text-white flex items-center"
                onClick={() => setAddButton(!addbutton)}
              >
                Add
                <AddRounded />
              </button>
            )}
          </div>
          <div className="overflow-x-auto overflow-y-auto border-2 rounded-lg relative top-[-5px]">
            <table className="w-full border-collapse table-auto bo">
              <thead>
                <tr className="bg-tablehead border-b-2 text-left">
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("name")}
                  >
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("created")}
                  >
                    Created{" "}
                    {sortBy === "created" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="cursor-pointer text-left border-b p-2"
                    onClick={() => handleSortChange("modified")}
                  >
                    Modified{" "}
                    {sortBy === "modified" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="cursor-pointer text-left border-b p-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientLoading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-error">
                      Loading clients...
                    </td>
                  </tr>
                ) : clientError ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-error">
                      Error loading clients: {clientError.message}
                    </td>
                  </tr>
                ) : !Array.isArray(clientList?.data) ||
                  clientList.data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-error">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clientList?.data.map((client) => (
                    <tr
                      className={`border-b hover:bg-gray-100 ${
                        client.Id === selectedClientId ? "bg-blue-100" : ""
                      }`}
                      key={client.Id}
                    >
                      <td className="p-1 text-left">
                        {editingClientId === client.Id ? (
                          <input
                            type="text"
                            value={editableClient?.Name || ""}
                            onChange={(e) =>
                              setEditableClient((prev) => ({
                                ...prev!,
                                Name: e.target.value,
                              }))
                            }
                            className="border p-2 rounded"
                          />
                        ) : (
                          client.Name
                        )}
                      </td>
                      <td className="p-1 text-left">{client.Created}</td>
                      <td className="p-1 text-left">{client.Modified}</td>
                      <td className="p-1 text-left flex gap-2">
                        {editingClientId === client.Id ? (
                          <>
                            <button
                              onClick={handleSaveClient}
                              className="mr-2 text-success"
                            >
                              <SaveRounded />
                            </button>
                            <button
                              onClick={handleCancelClient}
                              className="mr-2 text-error"
                            >
                              <CancelRounded />
                            </button>
                          </>
                        ) : (
                          <>
                            {accessDetails &&
                              accessDetails[0]?.CanUpdate === "1" && (
                                <button
                                  onClick={() =>
                                    handleEditClient(client.Id || "", client)
                                  }
                                  className="mr-2 text-success"
                                >
                                  <EditRounded />
                                </button>
                              )}
                            {accessDetails &&
                              accessDetails[0]?.CanDelete === "1" && (
                                <button
                                  onClick={() =>
                                    handleDeleteManufacturer(client.Id || "")
                                  }
                                  className="mr-2 text-error"
                                >
                                  <DeleteRounded />
                                </button>
                              )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {(clientList?.data.length ? clientList?.data.length : 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((clientList?.totalCount || 0) / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      {addbutton && accessDetails && accessDetails[0]?.CanCreate === "1" && (
        <ClientAddOverlay
          onOverlayClose={handleOverlayClose}
          onSuccess={handelSuccess}
        />
      )}
    </>
  );
}

export default ClientMaintenanceContainer;
