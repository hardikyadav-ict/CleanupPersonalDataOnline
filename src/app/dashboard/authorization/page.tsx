"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, FileSignature } from "lucide-react";

export default function AuthorizationPage() {
  const [authData, setAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await fetch("/api/user/authorization");
        const data = await res.json();
        setAuthData(data);
        setSigned(data.signed);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAuth();
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signature = canvas.toDataURL("image/png");
    if (signature === canvas.toDataURL()) {
      // empty canvas
      return;
    }
    setSigning(true);
    try {
      const res = await fetch("/api/user/authorization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      if (res.ok) {
        setSigned(true);
      }
    } catch (e) {
      console.error(e);
    }
    setSigning(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (signed) {
    return (
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Authorization Form</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authorization Signed</h2>
            <p className="text-gray-500">
              Signed on {authData?.signedAt ? new Date(authData.signedAt).toLocaleDateString() : "N/A"}
            </p>
            <div className="mt-6 text-sm text-gray-600">
              <p>You have granted us the right to act on your behalf</p>
              <p>to demand data brokers remove your personal information.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Authorization Form</h1>
        <p className="text-gray-500 mt-1">
          Grant us the right to act on your behalf
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <p className="font-medium mb-1">Why we need this</p>
            <p>
              This authorization form gives us the legal right to contact data brokers
              and request removal of your personal information under applicable privacy laws
              (CCPA, GDPR, etc.).
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>By signing below, you authorize PrivacyShield to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Search for your personal information on data broker databases</li>
              <li>Submit opt-out and removal requests on your behalf</li>
              <li>Correspond with data brokers regarding your privacy rights</li>
              <li>Resubmit requests periodically to ensure continued removal</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sign below using your mouse or touch
            </label>
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              className="w-full border-2 border-gray-300 rounded-lg bg-white cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <button
              onClick={clearSignature}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear signature
            </button>
          </div>

          <div className="flex gap-3">
            <Button onClick={submitSignature} loading={signing}>
              <FileSignature className="mr-2 w-4 h-4" />
              Sign Authorization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
