#!/usr/bin/env zsh
#
# apply-dropin.sh - Apply the jni-ts-template modernization drop-in files.
#
# Place this script in the ROOT of the jni-ts-template repo and run it from
# there. It operates on its own repository (the directory it lives in) and
# pulls the drop-in files from a flat folder (default: ~/Desktop/dropin),
# copying each to its correct path inside the repo.
#
# Source files are OVERWRITTEN in place; nothing tracked is deleted. Only
# regenerable artifacts (dist/, optionally node_modules/ + pnpm-lock.yaml) are
# removed. Safety net is git: refuses to run with uncommitted TRACKED changes
# unless --force, and creates a branch unless --no-branch.
#
# Corepack is not used (removed from Node 25+). pnpm must already be installed;
# it self-honors the package.json "packageManager" field.
#
# Usage:
#   ./apply-dropin.sh [options]
#
# Options:
#   --dropin <dir>   Drop-in folder (default: ~/Desktop/dropin)
#   --no-branch      Do not create a git branch before applying
#   --fresh          Also remove node_modules/ and pnpm-lock.yaml (clean install)
#   --install        After copying, run: pnpm install && pnpm run build
#   --force          Proceed even with uncommitted tracked changes
#   --dry-run        Print actions without changing anything
#   -h, --help       Show this help

set -eu
set -o pipefail

# --- Repo root = this script's own directory --------------------------------
TARGET=${0:A:h}

# --- Defaults ---------------------------------------------------------------
DROPIN=${HOME}/Desktop/dropin
MAKE_BRANCH=1
FRESH=0
RUN_INSTALL=0
FORCE=0
DRY_RUN=0
BRANCH_NAME="chore/modernize-ts6-node26"

# Relative destination paths inside the repo. Source is "${DROPIN}/${dest:t}"
# for each entry (all drop-in basenames are unique).
local -a DEST_PATHS
DEST_PATHS=(
	package.json
	tsconfig.json
	eslint.config.js
	Dockerfile
	docker-compose.yaml
	pnpm-workspace.yaml
	AGENTS.md
	src/App.ts
	src/shared/helpers.ts
	src/shared/SharedFunctions.ts
	src/shared/logger/log.ts
	src/shared/optional/optional.ts
	src/shared/enums/enums.ts
)

# --- Helpers ----------------------------------------------------------------
err()  { print -r -- "ERROR: $*" >&2 }
info() { print -r -- "  $*" }

usage() {
	print -r -- "Usage: ./apply-dropin.sh [options]"
	print -r -- ""
	print -r -- "  --dropin <dir>   Drop-in folder (default: ~/Desktop/dropin)"
	print -r -- "  --no-branch      Do not create a git branch before applying"
	print -r -- "  --fresh          Also remove node_modules/ and pnpm-lock.yaml"
	print -r -- "  --install        After copying, run: pnpm install && pnpm run build"
	print -r -- "  --force          Proceed even with uncommitted tracked changes"
	print -r -- "  --dry-run        Print actions without changing anything"
	print -r -- "  -h, --help       Show this help"
	exit ${1:-0}
}

run() {
	if (( DRY_RUN )); then
		print -r -- "DRY-RUN: $*"
	else
		"$@"
	fi
}

# --- Parse arguments --------------------------------------------------------
while (( $# )); do
	case "$1" in
		--dropin)    DROPIN=${2:?--dropin needs a path}; shift 2 ;;
		--no-branch) MAKE_BRANCH=0; shift ;;
		--fresh)     FRESH=1; shift ;;
		--install)   RUN_INSTALL=1; shift ;;
		--force)     FORCE=1; shift ;;
		--dry-run)   DRY_RUN=1; shift ;;
		-h|--help)   usage 0 ;;
		*)           err "unknown option: $1"; usage 1 ;;
	esac
done

# --- Validate ---------------------------------------------------------------
[[ -d ${DROPIN} ]]        || { err "drop-in folder not found: ${DROPIN}"; exit 1 }
[[ -d ${TARGET}/.git ]]   || { err "not a git repository: ${TARGET}"; exit 1 }
[[ -f ${TARGET}/package.json ]] || { err "no package.json in ${TARGET}"; exit 1 }

print -r -- "Repo:    ${TARGET}"
print -r -- "Drop-in: ${DROPIN}"

# All expected drop-in files must be present before touching anything.
print -r -- "Checking drop-in files ..."
local missing=0 dest
for dest in $DEST_PATHS; do
	[[ -f ${DROPIN}/${dest:t} ]] || { err "missing drop-in file: ${dest:t}"; missing=1 }
done
(( missing )) && { err "aborting - complete the drop-in folder and retry"; exit 1 }
info "all ${#DEST_PATHS} files present"

# Refuse on uncommitted TRACKED changes (untracked files, incl. this script
# and the drop-in folder, are ignored) unless --force.
if (( ! FORCE )); then
	if ! git -C "${TARGET}" diff --quiet || ! git -C "${TARGET}" diff --cached --quiet; then
		err "uncommitted tracked changes present. Commit/stash first, or pass --force."
		exit 1
	fi
fi

# --- Branch -----------------------------------------------------------------
if (( MAKE_BRANCH )); then
	print -r -- "Creating branch ${BRANCH_NAME} ..."
	if git -C "${TARGET}" rev-parse --verify --quiet "${BRANCH_NAME}" >/dev/null; then
		info "branch exists - checking it out"
		run git -C "${TARGET}" checkout "${BRANCH_NAME}"
	else
		run git -C "${TARGET}" checkout -b "${BRANCH_NAME}"
	fi
fi

# --- Copy -------------------------------------------------------------------
print -r -- "Applying drop-in files ..."
for dest in $DEST_PATHS; do
	run mkdir -p "${TARGET}/${dest:h}"
	run cp "${DROPIN}/${dest:t}" "${TARGET}/${dest}"
	info "${dest}"
done

# --- Cleanup ----------------------------------------------------------------
print -r -- "Cleaning build artifacts ..."
run rm -rf "${TARGET}/dist"
if (( FRESH )); then
	info "fresh install requested - removing node_modules/ and pnpm-lock.yaml"
	run rm -rf "${TARGET}/node_modules"
	run rm -f "${TARGET}/pnpm-lock.yaml"
fi

# --- Install / build (optional) --------------------------------------------
if (( RUN_INSTALL )); then
	if ! command -v pnpm >/dev/null 2>&1; then
		err "pnpm not found. Install it first: https://pnpm.io/installation"
		exit 1
	fi
	print -r -- "Installing and building ..."
	run pnpm -C "${TARGET}" install
	run pnpm -C "${TARGET}" run build
fi

# --- Summary ----------------------------------------------------------------
print -r -- ""
print -r -- "Done."
if (( ! RUN_INSTALL )); then
	print -r -- "Next steps:"
	print -r -- "  pnpm install            # pnpm honors the packageManager field itself"
	print -r -- "  pnpm run build && pnpm test"
fi
print -r -- "Review by hand (not touched by this script):"
print -r -- "  .vscode/{tasks,launch}.json, *.code-workspace  -> dist/App.js path is now dist/src/App.js"
print -r -- "  README.md                                       -> may list outdated commands"
