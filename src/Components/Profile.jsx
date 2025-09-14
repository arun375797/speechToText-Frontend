import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  User, 
  Mail, 
  Calendar, 
  Mic, 
  FileText, 
  DollarSign, 
  Clock,
  TrendingUp,
  Award,
  Settings,
  Edit3
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";
import useSession from "../hooks/useSession";

export default function Profile() {
  const { user, setUser } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        withCredentials: true
      });
      setProfileData(response.data);
      setEditForm({
        name: response.data.user.name || "",
        email: response.data.user.email || ""
      });
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, editForm, {
        withCredentials: true
      });
      
      setProfileData(prev => ({
        ...prev,
        user: { ...prev.user, ...editForm }
      }));
      
      setUser(prev => ({ ...prev, ...editForm }));
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profileData?.user?.name || "",
      email: profileData?.user?.email || ""
    });
    setEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  const stats = profileData.stats || {};
  const userData = profileData.user || {};

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-gradient">
            Profile Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your account and view your transcription statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <motion.div 
              className="card card-hover p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200">
                  {userData.name || "User"}
                </h2>
                <p className="text-slate-400">{userData.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Member since</p>
                    <p className="text-slate-200 font-medium">
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-slate-200 font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-600/30">
                  <button
                    onClick={handleEdit}
                    className="btn btn-secondary w-full"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Statistics and Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="card card-hover p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Transcriptions</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">
                      {stats.totalTranscriptions || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="card card-hover p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Cost</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-2">
                      {formatCurrency(stats.totalCost || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="card card-hover p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Duration</p>
                    <p className="text-3xl font-bold text-cyan-400 mt-2">
                      {Math.round(stats.totalDuration || 0)}m
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="card card-hover p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">This Month</p>
                    <p className="text-3xl font-bold text-violet-400 mt-2">
                      {stats.thisMonthTranscriptions || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-violet-400" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="card card-hover p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              
              {stats.recentTranscriptions && stats.recentTranscriptions.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentTranscriptions.slice(0, 5).map((transcription, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl">
                      <div className="flex-1">
                        <p className="text-slate-200 text-sm truncate">
                          {transcription.text?.substring(0, 50)}...
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {formatDate(transcription.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 text-sm font-medium">
                          {formatCurrency(transcription.cost || 0)}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {Math.round(transcription.duration || 0)}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No recent activity</p>
                  <p className="text-slate-500 text-sm">Start transcribing to see your activity here</p>
                </div>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div 
              className="card card-hover p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border-2 ${
                  (stats.totalTranscriptions || 0) >= 1 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-slate-600/50 bg-slate-800/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Award className={`w-6 h-6 ${
                      (stats.totalTranscriptions || 0) >= 1 ? 'text-emerald-400' : 'text-slate-500'
                    }`} />
                    <div>
                      <p className="text-slate-200 font-medium">First Transcription</p>
                      <p className="text-slate-400 text-sm">Complete your first transcription</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  (stats.totalTranscriptions || 0) >= 10 
                    ? 'border-blue-500/50 bg-blue-500/10' 
                    : 'border-slate-600/50 bg-slate-800/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Award className={`w-6 h-6 ${
                      (stats.totalTranscriptions || 0) >= 10 ? 'text-blue-400' : 'text-slate-500'
                    }`} />
                    <div>
                      <p className="text-slate-200 font-medium">Power User</p>
                      <p className="text-slate-400 text-sm">Complete 10 transcriptions</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  (stats.totalTranscriptions || 0) >= 50 
                    ? 'border-purple-500/50 bg-purple-500/10' 
                    : 'border-slate-600/50 bg-slate-800/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Award className={`w-6 h-6 ${
                      (stats.totalTranscriptions || 0) >= 50 ? 'text-purple-400' : 'text-slate-500'
                    }`} />
                    <div>
                      <p className="text-slate-200 font-medium">Transcription Master</p>
                      <p className="text-slate-400 text-sm">Complete 50 transcriptions</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  (stats.totalCost || 0) >= 100 
                    ? 'border-yellow-500/50 bg-yellow-500/10' 
                    : 'border-slate-600/50 bg-slate-800/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Award className={`w-6 h-6 ${
                      (stats.totalCost || 0) >= 100 ? 'text-yellow-400' : 'text-slate-500'
                    }`} />
                    <div>
                      <p className="text-slate-200 font-medium">Big Spender</p>
                      <p className="text-slate-400 text-sm">Spend ₹100+ on transcriptions</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />
            <motion.div 
              className="relative card p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-slate-200 mb-6">Edit Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-3 rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button onClick={handleSave} className="btn btn-primary flex-1">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
