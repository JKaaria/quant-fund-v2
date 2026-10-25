# Forward paper performance

Forward paper only. Daily return = NAV_t / NAV_previous_observation - 1; cumulative return = NAV_t / 1000000 - 1. Only actual retained frozen-fund GBP marks supply NAV. Virtual allocation NAV and allocation reserve are budgets, not marked NAV or broker cash. Missing marks remain null. First return uses starting NAV; gaps in marks break daily returns. No backtest splice or hypothetical backfill.

Only retained actual GBP costs are totaled. Missing costs and native non-GBP costs have unavailable GBP totals. No net-of-all-costs claim; spread, financing and slippage coverage are not established. Fill counts remain unavailable in decision-only evidence.

Annualized metrics require 252 return observations under the publication policy. Unavailable values are null in JSON and empty cells in CSV. The website displays published values and does not estimate missing valuations.

UNAVAILABLE: no approved redistributable benchmark source is bound.
