"""Sudoku symmetry transforms for board variety without re-generation.

Sudoku's symmetry group preserves validity:
- Digit permutation (relabel values)
- Row permutation within bands
- Column permutation within stacks
- Band permutation (swap horizontal bands)
- Stack permutation (swap vertical stacks)
- Transpose (reflect across main diagonal)

For N=3: ~1.22 billion distinct grids per base template.
"""

import random
from dataclasses import dataclass, field


@dataclass
class SudokuTransform:
    """A random symmetry transform that preserves Sudoku validity."""

    digit_perm: list[int] = field(default_factory=list)  # length M+1, 0→0
    row_perms: list[list[int]] = field(default_factory=list)  # N lists of N indices
    col_perms: list[list[int]] = field(default_factory=list)  # N lists of N indices
    band_perm: list[int] = field(default_factory=list)  # permutation of range(N)
    stack_perm: list[int] = field(default_factory=list)  # permutation of range(N)
    do_transpose: bool = False

    @classmethod
    def random(cls, N: int) -> "SudokuTransform":
        M = N * N

        # Digit permutation: 0→0, then random permutation of 1..M
        digits = list(range(1, M + 1))
        random.shuffle(digits)
        digit_perm = [0] + digits

        # Row permutation within each band
        row_perms = []
        for _ in range(N):
            perm = list(range(N))
            random.shuffle(perm)
            row_perms.append(perm)

        # Column permutation within each stack
        col_perms = []
        for _ in range(N):
            perm = list(range(N))
            random.shuffle(perm)
            col_perms.append(perm)

        # Band permutation
        band_perm = list(range(N))
        random.shuffle(band_perm)

        # Stack permutation
        stack_perm = list(range(N))
        random.shuffle(stack_perm)

        do_transpose = random.choice([True, False])

        return cls(
            digit_perm=digit_perm,
            row_perms=row_perms,
            col_perms=col_perms,
            band_perm=band_perm,
            stack_perm=stack_perm,
            do_transpose=do_transpose,
        )

    def apply(self, board: dict[str, int], N: int) -> dict[str, int]:
        """Apply this transform to a board dict. O(M^2) single pass."""
        M = N * N
        result: dict[str, int] = {}

        for pos_str, val in board.items():
            pos = int(pos_str)
            r, c = divmod(pos, M)

            # Spatial transform: band/row within band, stack/col within stack
            src_band, src_row_in_band = divmod(r, N)
            src_stack, src_col_in_stack = divmod(c, N)

            new_band = self.band_perm[src_band]
            new_row_in_band = self.row_perms[new_band][src_row_in_band]
            new_r = new_band * N + new_row_in_band

            new_stack = self.stack_perm[src_stack]
            new_col_in_stack = self.col_perms[new_stack][src_col_in_stack]
            new_c = new_stack * N + new_col_in_stack

            if self.do_transpose:
                new_r, new_c = new_c, new_r

            new_pos = new_r * M + new_c
            new_val = self.digit_perm[val] if val != 0 else 0
            result[str(new_pos)] = new_val

        return result
