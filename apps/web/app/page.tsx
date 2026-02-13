"use client";
import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleRoom = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleJoinRoom = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(`/room/${roomName}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Join a room
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Enter a room name to start chatting.
            </p>
          </div>

          {token ? (
            <button
              className="self-start text-sm font-medium text-gray-700 underline hover:text-gray-900 sm:self-auto"
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
                router.refresh();
              }}
            >
              Logout
            </button>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          {!token ? (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="font-semibold">Login required</div>
              <div className="mt-1 text-amber-800">
                You need to login to connect to chat rooms.
                <button
                  className="ml-2 font-medium underline cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Go to login
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-5 flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 font-medium text-gray-800">
                Authenticated
              </span>
              <span className="text-gray-400">•</span>
              <span>Ready to join</span>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block">
              <div className="text-sm font-medium text-gray-900">Room name</div>
              <input
                type="text"
                value={roomName}
                onChange={handleRoom}
                placeholder="e.g. ndjs"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
              />
            </label>

            <Button onClick={handleJoinRoom} className="cursor-pointer sm:h-10">
              Join Room
            </Button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Tip: share the URL with others to join the same room.
          </p>
        </div>
      </div>
    </div>
  );
}
