# Install and Set Up kubectl on macOS | Kubernetes

Source: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos

# Install and Set Up kubectl on macOS

## Before you begin

You must use a kubectl version that is within one minor version difference of
your cluster. For example, a v1.36 client can communicate
with v1.35, v1.36,
and v1.37 control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.

## Install kubectl on macOS

The following methods exist for installing kubectl on macOS:

- [Install kubectl on macOS](#install-kubectl-on-macos)
  - [Install kubectl binary with curl on macOS](#install-kubectl-binary-with-curl-on-macos)
  - [Install with Homebrew on macOS](#install-with-homebrew-on-macos)
  - [Install with Macports on macOS](#install-with-macports-on-macos)
- [Verify kubectl configuration](#verify-kubectl-configuration)
- [Optional kubectl configurations and plugins](#optional-kubectl-configurations-and-plugins)
  - [Enable shell autocompletion](#enable-shell-autocompletion)
  - [Install `kubectl convert` plugin](#install-kubectl-convert-plugin)

### Install kubectl binary with curl on macOS

1. Download the latest release:

   - Intel
   - Apple Silicon

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   ```

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   ```

   #### Note:

   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   portion of the command with the specific version.

   For example, to download version 1.36.0 on Intel macOS, type:

   ```
   curl -LO "https://dl.k8s.io/release/v1.36.0/bin/darwin/amd64/kubectl"
   ```

   And for macOS on Apple Silicon, type:

   ```
   curl -LO "https://dl.k8s.io/release/v1.36.0/bin/darwin/arm64/kubectl"
   ```
2. Validate the binary (optional)

   Download the kubectl checksum file:

   - Intel
   - Apple Silicon

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   ```

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   ```

   Validate the kubectl binary against the checksum file:

   ```
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   If valid, the output is:

   ```
   kubectl: OK
   ```

   If the check fails, `shasum` exits with nonzero status and prints output similar to:

   ```
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   #### Note:

   Download the same version of the binary and checksum.
3. Make the kubectl binary executable.

   ```
   chmod +x ./kubectl
   ```
4. Move the kubectl binary to a file location on your system `PATH`.

   ```
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   #### Note:

   Make sure `/usr/local/bin` is in your PATH environment variable.
5. Test to ensure the version you installed is up-to-date:

   ```
   kubectl version --client
   ```

   Or use this for detailed view of version:

   ```
   kubectl version --client --output=yaml
   ```
6. After installing and validating kubectl, delete the checksum file:

   ```
   rm kubectl.sha256
   ```

### Install with Homebrew on macOS

If you are on macOS and using [Homebrew](https://brew.sh/) package manager,
you can install kubectl with Homebrew.

1. Run the installation command:

   ```
   brew install kubectl
   ```

   or

   ```
   brew install kubernetes-cli
   ```
2. Test to ensure the version you installed is up-to-date:

   ```
   kubectl version --client
   ```

### Install with Macports on macOS

If you are on macOS and using [Macports](https://macports.org/) package manager,
you can install kubectl with Macports.

1. Run the installation command:

   ```
   sudo port selfupdate
   sudo port install kubectl
   ```
2. Test to ensure the version you installed is up-to-date:

   ```
   kubectl version --client
   ```

## Verify kubectl configuration

In order for kubectl to find and access a Kubernetes cluster, it needs a
[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
which is created automatically when you create a cluster using
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
or successfully deploy a Minikube cluster.
By default, kubectl configuration is located at `~/.kube/config`.

Check that kubectl is properly configured by getting the cluster state:

```
kubectl cluster-info
```

If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly
or is not able to connect to a Kubernetes cluster.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

For example, if you are intending to run a Kubernetes cluster on your laptop (locally),
you will need a tool like [Minikube](https://minikube.sigs.k8s.io/docs/start/) to be
installed first and then re-run the commands stated above.

If `kubectl cluster-info` returns the url response, but you can't access your cluster,
check whether it is configured properly using the following command:

```
kubectl cluster-info dump
```

### Troubleshooting the 'No Auth Provider Found' error message

In Kubernetes 1.26, kubectl removed the built-in authentication for the following cloud
providers' managed Kubernetes offerings. These providers have released kubectl plugins
to provide the cloud-specific authentication. For instructions, refer to the following provider documentation:

- Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
- Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

There could also be other causes for the same error message that are unrelated
to that change.

## Optional kubectl configurations and plugins

kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell
which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash, Fish, and Zsh.

### Configure kuberc

See [kuberc](/docs/reference/kubectl/kuberc/) for more information.

### Install `kubectl convert` plugin

A plugin for Kubernetes command-line tool `kubectl`, which allows you to convert manifests between different API
versions. This can be particularly helpful to migrate manifests to a non-deprecated api version with newer Kubernetes release.
For more info, visit [migrate to non deprecated apis](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)

1. Download the latest release with the command:

   - Intel
   - Apple Silicon

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   ```

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   ```
2. Validate the binary (optional)

   Download the kubectl-convert checksum file:

   - Intel
   - Apple Silicon

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   ```

   ```
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   ```

   Validate the kubectl-convert binary against the checksum file:

   ```
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   If valid, the output is:

   ```
   kubectl-convert: OK
   ```

   If the check fails, `shasum` exits with nonzero status and prints output similar to:

   ```
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   #### Note:

   Download the same version of the binary and checksum.
3. Make kubectl-convert binary executable

   ```
   chmod +x ./kubectl-convert
   ```
4. Move the kubectl-convert binary to a file location on your system `PATH`.

   ```
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   #### Note:

   Make sure `/usr/local/bin` is in your PATH environment variable.
5. Verify plugin is successfully installed

   ```
   kubectl convert --help
   ```

   If you do not see an error, it means the plugin is successfully installed.
6. After installing the plugin, clean up the installation files:

   ```
   rm kubectl-convert kubectl-convert.sha256
   ```

### Uninstall kubectl on macOS

Depending on how you installed `kubectl`, use one of the following methods.

### Uninstall kubectl using the command-line

1. Locate the `kubectl` binary on your system:

   ```
   which kubectl
   ```
2. Remove the `kubectl` binary:

   ```
   sudo rm <path>
   ```

   Replace `<path>` with the path to the `kubectl` binary from the previous step. For example, `sudo rm /usr/local/bin/kubectl`.

### Uninstall kubectl using homebrew

If you installed `kubectl` using Homebrew, run the following command:

```
brew remove kubectl
```

## What's next

- Learn about [kubectl](/docs/concepts/overview/kubectl/) and its role in the Kubernetes ecosystem.
- [Install Minikube](https://minikube.sigs.k8s.io/docs/start/)
- See the [getting started guides](/docs/setup/) for more about creating clusters.
- [Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
- If you need access to a cluster you didn't create, see the
  [Sharing Cluster Access document](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
- Read the [kubectl reference docs](/docs/reference/kubectl/kubectl/)

Last modified May 15, 2025 at 9:23 AM PST: [Add kuberc dedicated page (edac5dbf0e)](https://github.com/kubernetes/website/commit/edac5dbf0e2cf8c1ab7b8a3ee9daec7c54db7fab)
