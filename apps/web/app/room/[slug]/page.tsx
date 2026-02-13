"use client";

import { useEffect, useState } from "react";
import ChatRoomClient from "@/components/ChatRoomClient";
import { getRoomBySlug } from "@/services/api/room";
import { getChatByRoomId, type ChatMessage } from "@/services/api/chat";
import { useParams, useRouter } from "next/navigation";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!slug) {
        setError("Missing room slug in URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const id = await getRoomBySlug(slug);
        const msgs = await getChatByRoomId(id);
        if (cancelled) return;
        setRoomId(id);
        setMessages(msgs);
      } catch (e) {
        if (cancelled) return;
        const err = e as {
          response?: { data?: { message?: unknown } };
          message?: unknown;
        };

        const msg =
          (typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : undefined) ??
          (typeof err.message === "string" ? err.message : undefined) ??
          "Failed to load room.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Chat Room
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 font-medium text-gray-800">
                {slug ?? ""}
              </span>
              <span className="text-green-400">•</span>
              <span>
                {loading
                  ? "Connecting…"
                  : error
                    ? "Error"
                    : roomId
                      ? "Connected"
                      : "Not found"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Room</h2>
            <p className="mt-1 text-sm text-gray-600">
              Room Name: <span className="font-medium text-gray-900">{slug ?? ""}</span>
            </p>
          </div>

          <div className="px-5 py-5">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
                <div className="h-24 w-full animate-pulse rounded-xl bg-gray-50" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <div className="font-semibold">Couldn’t load this room</div>
                <div className="mt-1 text-red-700">{error}</div>
              </div>
            ) : roomId ? (
              <ChatRoomClient id={roomId} messages={messages} />
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="font-semibold">Room not found</div>
                <div className="mt-1 text-amber-800">
                  Check the room name in the URL and try again.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
