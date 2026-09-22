// PAL-WALK pass-4 CRITIC — appended to a SCRATCH COPY of src/games/shared/useSession.test.ts
// (bootPage / stFrame / inkFor are that file's own helpers); run with
// `npx vitest run --config <scratch vitest config with a private cacheDir> src/games/shared/useSession.test.ts`.
describe("CRITIC — the relay race at the SAME epoch (every holder answers one `hi`)", () => {
  it("S1 — a non-author's st of the SAME epoch arrives first: does the author's word land?", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-s1");
    const inkOf = (id: string) => p.session.session.players.value.find((r) => r.id === id)?.ink;
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3, k: { "peer-1": 5, "peer-3": 9 } }), "peer-2");
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3, k: { "peer-1": 5, "peer-3": 6 } }), "peer-1");
    p.peer("peer-3", true);
    expect(inkOf("peer-3")).toEqual(inkFor(6));
  });
  it("S2 — the control: the author first, the relayer second (same epoch)", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-s2");
    const inkOf = (id: string) => p.session.session.players.value.find((r) => r.id === id)?.ink;
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3, k: { "peer-1": 5, "peer-3": 6 } }), "peer-1");
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3, k: { "peer-1": 5, "peer-3": 9 } }), "peer-2");
    p.peer("peer-3", true);
    expect(inkOf("peer-3")).toEqual(inkFor(6));
  });
});
