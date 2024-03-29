import { Command } from '@oclif/core'
import { execa } from 'execa'

export const GIT_FIRST_COMMIT_MESSAGE = 'Kita project started! 🪷'
export const GIT_MAIN_BRANCH = 'main'

/**
 * Creates a Git repository and performs the initial commit if it doesn't already exist.
 *
 * This function checks if Git is installed, initializes a Git repository in the specified
 * directory if it's not already a Git repository, and performs the initial commit.
 */
export async function createGitRepository (command: Command,  dir = '.') {
  if (!await isGitInstalled()) {
    command.error('Git is not installed')
  }

  if (!await gitInit(command, dir)) {
    return
  }

  if (!await gitCommit(command, dir)) {
    return
  }

  command.log('Git repository initialized.')
}

/**
 * Checks if Git is installed on the system.
 */
async function isGitInstalled () {
  try {
    await execa('git', ['--version'])
    return true
  } catch (err) {
    return false
  }
}

/**
 * Checks if a Git repository exists in the specified directory.
 */
async function doesGitRepositoryExist (dir: string) {
  try {
    await execa('git', ['rev-parse', '--is-inside-work-tree'], { cwd: dir })
    return true
  } catch (e) {
    return false
  }
}

/**
 * Initializes a Git repository in the specified directory if it doesn't already exist.
 */
async function gitInit (command: Command, dir: string) {
    if (await doesGitRepositoryExist(dir)) {
      command.log('Git repository already exists.')
      return false
    }

    await execa('git', ['init', '-b', GIT_MAIN_BRANCH], { cwd: dir })
    command.log('Git repository initialized.')
    return true
  
}

/**
 * Commits changes in a Git repository located in the specified directory.
 */
async function gitCommit (command: Command, dir: string) {
    await execa('git', ['add', '-A'], { cwd: dir })
    await execa('git', ['commit', '-m', GIT_FIRST_COMMIT_MESSAGE], { cwd: dir })
    command.log('Git commit done.')
    return true
  
}