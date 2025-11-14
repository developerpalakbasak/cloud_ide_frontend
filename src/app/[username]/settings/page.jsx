"use client"
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import EditableField from "@/components/EditableField";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import API from "@/services/api";
import toast from "react-hot-toast";


const Settings = () => {
  const { loggedInUser } = useAuth();

  const [formData, setFormData] = useState({
    name: loggedInUser?.name || '',
    username: loggedInUser?.username || '',
    bio: loggedInUser?.bio || '',
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {

    try {
      const res = await API.post("user/update-info", formData)
      if (res.data.success) {
        toast.success(res.data.message)
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }



  };



  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-gray-800 rounded-lg shadow-md mt-5">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      <div className="flex w-full flex-col gap-4">
        <EditableField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleFieldChange}
        />
        <EditableField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleFieldChange}
          loggedInUsername={loggedInUser?.username}
        />
        <EditableField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleFieldChange}
        />

        {loggedInUser.isVerified &&
          <div className="w-full flex justify-between items-center bg-gray-900 text-white p-3 rounded-md shadow-sm">
            <span className="flex gap-2 justify-center items-center">
              <FaCheckCircle color="green" />
              <p className="text-sm">Verification Provider</p>
            </span>

            <label className="block text-sm font-semibold mb-1">{loggedInUser.provider}</label>

          </div>
        }

        {!loggedInUser.isVerified && (loggedInUser.provider === "Credentials") &&
          <div className="w-full flex justify-between items-center bg-gray-900 text-white p-3 rounded-md shadow-sm">
            <span className="flex gap-2 justify-center items-center">
              <FaExclamationCircle color="red" />
              <p className="text-sm">Not verified</p>
            </span>
            <button className="underline cursor-pointer text-sm font-semibold">
              Verify now
            </button>
          </div>
        }


      </div>

      <button
        onClick={handleSaveAll}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto transition-colors"
      >
        Save All
      </button>
    </div>
  );
};

export default Settings;
