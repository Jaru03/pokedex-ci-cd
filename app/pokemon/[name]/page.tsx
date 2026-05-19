import Image from "next/image";
import Link from "next/link";
import { getPokemon } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/type-colors";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function PokemonPage({ params }: Props) {
  const { name } = await params;
  const poke = await getPokemon(name);

  const artwork =
    poke.sprites.other["official-artwork"].front_default ||
    poke.sprites.front_default;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          ← Back to list
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 flex items-center justify-center py-10">
            <Image
              src={artwork}
              alt={poke.name}
              width={200}
              height={200}
              priority
            />
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold capitalize text-gray-800">
                {poke.name}
              </h1>
              <span className="text-gray-400 font-mono text-lg">
                #{String(poke.id).padStart(3, "0")}
              </span>
            </div>

            <div className="flex gap-2">
              {poke.types.map(({ type }) => (
                <span
                  key={type.name}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${TYPE_COLORS[type.name] ?? "bg-gray-300 text-gray-700"}`}
                >
                  {type.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Height</p>
                <p className="font-semibold text-gray-800">
                  {(poke.height / 10).toFixed(1)} m
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Weight</p>
                <p className="font-semibold text-gray-800">
                  {(poke.weight / 10).toFixed(1)} kg
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Stats
              </h2>
              <div className="space-y-2">
                {poke.stats.map(({ stat, base_stat }) => (
                  <div key={stat.name} className="flex items-center gap-3">
                    <span className="text-xs capitalize text-gray-500 w-24 shrink-0">
                      {stat.name.replace("-", " ")}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right shrink-0">
                      {base_stat}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((base_stat / 255) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Abilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {poke.abilities.map(({ ability, is_hidden }) => (
                  <span
                    key={ability.name}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-lg capitalize text-gray-700"
                  >
                    {ability.name.replace("-", " ")}
                    {is_hidden && (
                      <span className="ml-1 text-xs text-gray-400">
                        (hidden)
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
