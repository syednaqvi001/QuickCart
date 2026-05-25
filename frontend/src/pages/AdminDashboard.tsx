import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Plus, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const dashboardData = {
  salesData: [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 221 },
    { month: 'Mar', sales: 2000, orders: 229 },
    { month: 'Apr', sales: 2780, orders: 200 },
    { month: 'May', sales: 1890, orders: 229 },
  ],
  categoryData: [
    { name: 'Fruits', value: 35 },
    { name: 'Vegetables', value: 25 },
    { name: 'Dairy', value: 20 },
    { name: 'Bakery', value: 12 },
    { name: 'Others', value: 8 },
  ],
  stats: [
    { label: 'Total Orders', value: '1,234', icon: ShoppingCart, color: 'blue' },
    { label: 'Total Users', value: '856', icon: Users, color: 'green' },
    { label: 'Products', value: '342', icon: Package, color: 'purple' },
    { label: 'Revenue', value: '₹4.5L', icon: TrendingUp, color: 'orange' },
  ],
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Link
            to="/admin/products/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 font-semibold"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses: Record<string, string> = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            };

            return (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Sales Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Products by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Orders Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <Package size={32} className="text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Products</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove products from catalog</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <Users size={32} className="text-green-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Users</h3>
            <p className="text-gray-600 text-sm">View and manage customer accounts</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <ShoppingCart size={32} className="text-orange-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">View Orders</h3>
            <p className="text-gray-600 text-sm">Monitor orders and deliveries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
