import { useAuthStore } from '../store/authStore';
import { User, Mail, Phone, MapPin, LogOut, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="p-6 -mt-12">
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-center text-gray-600 mt-2">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Edit2 size={20} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <p className="font-semibold text-gray-800">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <p className="font-semibold text-gray-800">{user.lastName}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">+91 9876543210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-800">123 Main Street, New York, 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition font-semibold text-gray-800">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition font-semibold text-gray-800">
                  Manage Addresses
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition font-semibold text-gray-800">
                  Payment Methods
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition font-semibold text-gray-800">
                  Preferences
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center space-x-2"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
