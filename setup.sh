#!/usr/bin/env sh

node_version=19.3.0
pnpm_version=7.28.0

install_pnpm() {
  if test -z "$(command -v curl 2> /dev/null)"; then
    curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION="$pnpm_version" sh -
  elif test -z "$(command -v wget 2> /dev/null)"; then
    wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION="$pnpm_version" sh -
  else
    printf "failed to install pnpm, curl or wget not installed." && exit 1
  fi
}

if test -z "$(command -v pnpm 2> /dev/null)"; then
    printf "pnpm is required to build, do you want to install it? (Y/n) :"
    read -r response
    case $response in
      [Yy]*)
        install_pnpm
        ;;
      [Nn]*)
        exit 0
        ;;
      "")
        install_pnpm
        ;;
      *)
        echo "Invalid response"
        exit 1
        ;;
    esac
fi

install_node() {
  pnpm env use --global "$node_version" || printf "Failed to install node." && exit 1
}

if test -z "$(command -v node 2> /dev/null)"; then
    printf "node is required to build, do you want to install it? (Y/n) :"
    read -r response
    case $response in
      [Yy]*)
        install_node
        ;;
      [Nn]*)
        exit 0
        ;;
      "")
        install_node
        ;;
      *)
        echo "Invalid response"
        exit 1
        ;;
    esac
fi

pnpm install || printf "Failed to install dependencies." && exit 1
