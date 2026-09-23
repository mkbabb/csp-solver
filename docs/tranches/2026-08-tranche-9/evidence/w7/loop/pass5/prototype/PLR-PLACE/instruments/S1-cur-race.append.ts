// PLR-PLACE pass 5 — appended to a SCRATCH COPY of src/games/shared/useSession.test.ts (its own
// bootPage / stFrame / inkFor helpers). S1/S2 are PAL-WALK's critic's rows verbatim; C1/C2 are this
// lane's: the `cur` half of the same wire (a cursor racing the `st` it is tagged against).
describe("PAL-WALK CRITIC — the relay race at the SAME epoch", () => {
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
describe("PLR-PLACE — the cur half of the same wire", () => {
  it("C1 — a second same-epoch st (the relayer's answer) does not wipe a cursor heard between", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-c1");
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3 }), "peer-1");
    p.hear("cur", { p: 40, e: 3, ea: "peer-1" }, "peer-3");
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3 }), "peer-2");
    expect(p.session.peerCursors.value).toEqual({ "peer-3": 40 });
  });
  it("C2 — a cursor that races AHEAD of its st (a joiner's first second): is the still peer drawn after the adopt?", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-c2");
    p.hear("cur", { p: 40, e: 3, ea: "peer-1" }, "peer-3"); // peer-3 already holds e3 and moved
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3 }), "peer-1");
    expect(p.session.peerCursors.value, "a still peer, after the joiner adopts").toEqual({ "peer-3": 40 });
  });
  it("C3 — your own ring follows the wire: a new epoch clears what you sent, as it clears the room's", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-c3", true);
    p.session.noteFocus(12);
    expect(p.session.sentCell.value).toBe(12);
    p.hear("st", stFrame({ e: 9, ea: "peer-1", g: "sudoku", z: 3 }), "peer-1");
    expect(p.session.sentCell.value).toBeUndefined();
  });
});
