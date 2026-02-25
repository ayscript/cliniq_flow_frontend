import { useAdminStore } from "../../store/adminStore";


export const Users = () => {
  const { users, isLoading } = useAdminStore();

  
  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users size={20} className="text-gray-600" />
              Staff Directory
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Total: {users.length}
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading data...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        {/* Name & Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full bg-gray-200"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role & Department */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {user.role}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.department}
                            </span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-2 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border
      ${user.status === "On Duty" ? "bg-green-100 text-green-700 border-green-200" : ""}
      ${user.status === "On Leave" ? "bg-orange-100 text-orange-700 border-orange-200" : ""}
      ${user.status === "In Surgery" ? "bg-purple-100 text-purple-700 border-purple-200" : ""}
      ${user.status === "Active" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
    `}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
