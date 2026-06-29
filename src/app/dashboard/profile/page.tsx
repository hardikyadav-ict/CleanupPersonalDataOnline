"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, Trash2, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [phones, setPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", dateOfBirth: "" });
  const [newAddress, setNewAddress] = useState({ street: "", city: "", state: "", zipCode: "" });
  const [newPhone, setNewPhone] = useState({ number: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, addrRes, phoneRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/addresses"),
          fetch("/api/user/phones"),
        ]);
        const p = await profileRes.json();
        const a = await addrRes.json();
        const ph = await phoneRes.json();
        setProfile(p);
        setForm({
          firstName: p?.firstName || "",
          lastName: p?.lastName || "",
          dateOfBirth: p?.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
        });
        setAddresses(a);
        setPhones(ph);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
  };

  const addAddress = async () => {
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });
    if (res.ok) {
      setAddresses([...addresses, await res.json()]);
      setNewAddress({ street: "", city: "", state: "", zipCode: "" });
    }
  };

  const addPhone = async () => {
    const res = await fetch("/api/user/phones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPhone),
    });
    if (res.ok) {
      setPhones([...phones, await res.json()]);
      setNewPhone({ number: "" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const hasData = profile?.user?.email || form.firstName || addresses.length > 0 || phones.length > 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information used for data broker removals</p>
      </div>

      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-900">
                {hasData
                  ? "Your data is ready for broker removal requests"
                  : "Add your personal details below to start removing your data from brokers"}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                We use this information to fill opt-out forms on data broker websites on your behalf.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="email"
              label="Email"
              value={profile?.user?.email || ""}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <Input
              id="firstName"
              label="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              id="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Input
              id="dob"
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
            <div className="flex items-end">
              <Button onClick={saveProfile} loading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Addresses</h2>
            <Badge variant={addresses.length > 0 ? "success" : "warning"}>
              {addresses.length > 0 ? `${addresses.length} saved` : "None added"}
            </Badge>
          </div>
          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                    </p>
                    {addr.label && <p className="text-xs text-gray-500">{addr.label}</p>}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-4 gap-3">
            <Input
              id="street"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <Input
              id="city"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <Input
              id="state"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                id="zip"
                placeholder="ZIP"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              />
              <Button variant="secondary" onClick={addAddress}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Phone Numbers</h2>
            <Badge variant={phones.length > 0 ? "success" : "warning"}>
              {phones.length > 0 ? `${phones.length} saved` : "None added"}
            </Badge>
          </div>
          <div className="space-y-3 mb-4">
            {phones.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.number}</p>
                    {p.type && <p className="text-xs text-gray-500">{p.type}</p>}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={newPhone.number}
              onChange={(e) => setNewPhone({ number: e.target.value })}
              className="max-w-xs"
            />
            <Button variant="secondary" onClick={addPhone}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
