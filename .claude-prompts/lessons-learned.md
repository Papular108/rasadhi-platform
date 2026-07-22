# Lessons learned

Read before running shell commands in this project.

## pkill self-match (bitten 3x: streamlit x2, uvicorn x1)

`pkill -f "streamlit run"` matches its own command line and kills
itself before killing the target.

Fix — bracket the first letter:

    pkill -f "[s]treamlit run"
    pkill -f "[u]vicorn app.main"

Or just run ./backend/scripts/stop-servers.sh

## Environment

Dev env is `rasadhi-dev` (Python 3.11, rasadhi_core editable install).
Not qsar-api. When unsure: conda env list
