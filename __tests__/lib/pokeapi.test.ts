import { getPokemon, getPokemonIdFromUrl, getPokemonList } from "@/lib/pokeapi";

const mockFetch = jest.fn();
global.fetch = mockFetch;

afterEach(() => {
  mockFetch.mockReset();
});

describe("getPokemonList", () => {
  it("returns list of pokemon", async () => {
    const mockData = {
      count: 1302,
      next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      previous: null,
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getPokemonList(1);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon?limit=1&offset=0",
      expect.any(Object)
    );
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe("bulbasaur");
  });

  it("throws when the request fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(getPokemonList()).rejects.toThrow(
      "Failed to fetch pokemon list: 500"
    );
  });
});

describe("getPokemon", () => {
  it("returns a pokemon by name", async () => {
    const mockData = { id: 1, name: "bulbasaur" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getPokemon("bulbasaur");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/bulbasaur",
      expect.any(Object)
    );
    expect(result.name).toBe("bulbasaur");
    expect(result.id).toBe(1);
  });

  it("throws when pokemon is not found", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(getPokemon("fakemon")).rejects.toThrow(
      'Failed to fetch pokemon "fakemon": 404'
    );
  });
});

describe("getPokemonIdFromUrl", () => {
  it("extracts the id from a pokeapi url", () => {
    expect(getPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
    expect(getPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/1/")).toBe(1);
  });
});
