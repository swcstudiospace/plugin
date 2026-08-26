# Testing your SSH connection - GitHub Docs

Source: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection

# Testing your SSH connection

After you've set up your SSH key and added it to GitHub, you can test your connection.

## Platform navigation

Before testing your SSH connection, you should have already:

- [Checked for existing SSH keys](/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)
- [Generated a new SSH key](/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Added a new SSH key to your GitHub account](/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

You'll need to authenticate this action using your password, which is the SSH key passphrase you created earlier. See [Working with SSH key passphrases](/en/authentication/connecting-to-github-with-ssh/working-with-ssh-key-passphrases).

1. Open TerminalTerminalGit Bash.
2. Enter the following:

   ```
   ssh -T git@github.com
   # Attempts to ssh to GitHub
   ```

   You may see a warning like this:

   ```
   > The authenticity of host 'github.com (IP ADDRESS)' can't be established.
   > ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
   > Are you sure you want to continue connecting (yes/no)?
   ```
3. Verify that the fingerprint in the message you see matches [GitHub's public key fingerprint](/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints). If it does, then type `yes`:

   ```
   > Hi USERNAME! You've successfully authenticated, but GitHub does not
   > provide shell access.
   ```

   You may see this error message:

   ```
   ...
   Agent admitted failure to sign using the key.
   debug1: No more authentication methods to try.
   Permission denied (publickey).
   ```

   This is a known problem with certain Linux distributions. For more information, see [Error: Agent admitted failure to sign](/en/authentication/troubleshooting-ssh/error-agent-admitted-failure-to-sign).

   Note

   The remote command should exit with code 1.
4. Verify that the resulting message contains your username. If you receive a "permission denied" message, see [Error: Permission denied (publickey)](/en/authentication/troubleshooting-ssh/error-permission-denied-publickey).

Tip

If you are accessing GitHub at a different domain such as `octocorp.ghe.com`, then you need to replace `git@github.com` with `octocorp@octocorp.ghe.com`.

```
ssh -T octocorp@octocorp.ghe.com
# Attempts to ssh to octocorp.ghe.com
```
