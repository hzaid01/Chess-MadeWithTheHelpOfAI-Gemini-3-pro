# EnitChess C++ Source

This directory contains the original C++ source code for EnitChess.
It has been preserved here for reference and potential future native integration.

## How to Compile

The original project uses SFML for graphics. You will need to have SFML installed on your system.

### Linux / WSL

1.  Install SFML:
    ```bash
    sudo apt-get install libsfml-dev
    ```
2.  Run Make:
    ```bash
    make
    ```
3.  Run the executable:
    ```bash
    ./EnitChess
    ```

### Windows

You will need MinGW and SFML libraries set up. It is recommended to use the generated `Makefile` if you have `make` installed, or import the source files into Visual Studio.

**Note:** The web application uses a TypeScript port of the AI logic (located in `services/enitService.ts`) and does not use these files directly at runtime.
