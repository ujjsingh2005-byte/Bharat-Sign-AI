interface Sign {
  word: string;
  asset: string | null;
  type: string;
}

interface SignPlayerProps {
  signs: Sign[];
}

export default function SignPlayer({ signs }: SignPlayerProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h3 className="mb-6 text-2xl font-bold">🤟 ISL Sign Output</h3>

      {signs.length === 0 ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-500">
          No signs available yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {signs.map((sign, index) => (
            <div
              key={`${sign.word}-${index}`}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4"
            >
              <h4 className="mb-4 text-lg font-bold text-blue-400">
                {sign.word}
              </h4>

              {sign.asset ? (
                <video
                  controls
                  className="w-full rounded-xl"
                  src={`/signs/${sign.asset}.mp4`}
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-slate-950">
                  <div className="text-center">
                    <p className="text-yellow-400">Sign not available</p>

                    <p className="mt-2 text-sm text-slate-500">{sign.word}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
