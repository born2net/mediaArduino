/*
   Yún Disk Space Expander
  
  Requirements:
  * micro SD card
  * internet connection

  This sketch configure the SD card to expand the disk space
  of the Yún. Upload, open the Serial Monitor and follow
  the interactive procedure.

  Warning: your SD card will be formatted and you will lose 
  the files it contains. Be sure you have backed it up before 
  using it for expanding Yún’s disk space.
 
  created Apr 2014 
  by Federico Fissore & Federico Vanzati 

  This code is in the public domain.

  http://arduino.cc/en/Tutorial/ExtendingYunDiskSpace

*/

#include <Process.h>

#define DEBUG 0
#define SUCCESSFUL_EXIT_CODE 0

void setup() {
  Serial.begin(115200);
  while (!Serial);

  Serial.print(F("This sketch will format your micro SD card and use it as additional disk space for your Arduino Yun.\nPlease ensure you have ONLY your micro SD card plugged in: no pen drives, hard drives or whatever.\nDo you wish to proceed (yes/no)?"));
  expectYesBeforeProceeding();

  Serial.println(F("\nStarting Bridge..."));

  Bridge.begin();

  haltIfSDAlreadyOnOverlay();
  
  haltIfInternalFlashIsFull();

  haltIfSDCardIsNotPresent();

  installSoftware();

  partitionAndFormatSDCard();

  createArduinoFolder();

  copySystemFilesFromYunToSD();

  enableExtRoot();

  Serial.print(F("\nWe are done! Yeah! Now press the YUN RST button to apply the changes."));
}

void loop() {
  // This turns the sketch into a YunSerialTerminal
  if (Serial.available()) {
    char c = (char)Serial.read();
    Serial1.write(c);
  }
  if (Serial1.available()) {
    char c = (char)Serial1.read();
    Serial.write(c);
  }
}

void halt() {
  Serial.flush();
  while (true);
}

void expectYesBeforeProceeding() {
  Serial.flush();

  while (!Serial.available());

  String answer = Serial.readStringUntil('\n');

  Serial.print(F(" "));
  Serial.println(answer);
  if (answer != "yes") {
    Serial.println(F("\nGoodbye"));
    halt();
  }
}

int readPartitionSize() {
  int partitionSize = 0;
  while (!partitionSize)
  {
    Serial.print(F("Enter the size of the data partition in MB: "));
    while (Serial.available() == 0);

    String answer = Serial.readStringUntil('\n');
    partitionSize = answer.toInt();
    Serial.println(partitionSize);
    if (!partitionSize)
      Serial.println(F("Invalid input, retry"));
  }
  return partitionSize;
}

void debugProcess(Process p) {
  #if DEBUG == 1
  while (p.running());

  while (p.available() > 0) {
    char c = p.read();
    Serial.print(c);
  }
  Serial.flush();
  #endif
}

void haltIfSDAlreadyOnOverlay() {
  Process grep;

  grep.runShellCommand(F("mount | grep ^/dev/sda | grep 'on /overlay'"));
  String output = grep.readString();
  if (output != "") {
    Serial.println(F("\nMicro SD card is already used as additional Arduino Yun disk space. Nothing to do."));
    halt();
  }
}

void haltIfSDCardIsNotPresent() {
  Process ls;
  int exitCode = ls.runShellCommand("ls /mnt/sda1");

  if (exitCode != 0) {
    Serial.println(F("\nThe micro SD card is not available"));
    halt();
  }
}

void haltIfInternalFlashIsFull() {
  Process awk;

  awk.runShellCommand(F("df / | awk '/rootfs/ {print $4}'"));
  int output = awk.parseInt();
  if (output < 1000) {
    Serial.println(F("\nYou don't have enough disk space to install the utility software. You need to free at least 1MB of Flash memory.\nRetry!"));
    halt();
  }
}

void installSoftware() {
  Serial.print(F("\nReady to install utility software. Please ensure your Arduino Yun is connected to internet.\nReady to proceed (yes/no)?"));
  expectYesBeforeProceeding();

  Serial.println(F("Updating software list..."));

  Process opkg;

  // update the packages list
  int exitCode = opkg.runShellCommand("opkg update");
  // if the exitCode of the process is OK the package has been installed correctly
  if (exitCode != SUCCESSFUL_EXIT_CODE) {
    Serial.println(F("err. with opkg, check internet connection"));
    debugProcess(opkg);
    halt();
  }
  Serial.println(F("Software list updated. Installing software (this will take a while)..."));

  // install the utility to format in EXT4
  exitCode = opkg.runShellCommand(F("opkg install e2fsprogs mkdosfs fdisk rsync"));
  if (exitCode != SUCCESSFUL_EXIT_CODE) {
    Serial.println(F("err. installing e2fsprogs mkdosfs fdisk"));
    debugProcess(opkg);
    halt();
  }
  Serial.println(F("e2fsprogs mkdosfs fdisk rsync installed"));
}

void partitionAndFormatSDCard() {
  Serial.print(F("\nProceed with partitioning micro SD card (yes/no)?"));
  expectYesBeforeProceeding();

  unmount();

  Process format;

  //clears partition table
  format.runShellCommand("dd if=/dev/zero of=/dev/sda bs=4096 count=10");
  debugProcess(format);

  // create the first partition
  int dataPartitionSize = readPartitionSize();

  Serial.println(F("Partitioning (this will take a while)..."));
  String firstPartition = "(echo n; echo p; echo 1; echo; echo +";
  firstPartition += dataPartitionSize;
  firstPartition += "M; echo w) | fdisk /dev/sda";
  format.runShellCommand(firstPartition);
  debugProcess(format);

  unmount();

  // create the second partition
  format.runShellCommand(F("(echo n; echo p; echo 2; echo; echo; echo w) | fdisk /dev/sda"));
  debugProcess(format);

  unmount();

  // specify first partition is FAT32
  format.runShellCommand(F("(echo t; echo 1; echo c; echo w) | fdisk /dev/sda"));

  unmount();

  delay(5000);

  unmount();

  // format the first partition to FAT32
  int exitCode = format.runShellCommand(F("mkfs.vfat /dev/sda1"));
  debugProcess(format);
  if (exitCode != SUCCESSFUL_EXIT_CODE) {
    Serial.println(F("\nerr. formatting to FAT32"));
    halt();
  }
  delay(100);

  // format the second partition to Linux EXT4
  exitCode = format.runShellCommand(F("mkfs.ext4 /dev/sda2"));
  debugProcess(format);
  if (exitCode != SUCCESSFUL_EXIT_CODE) {
    Serial.println(F("\nerr. formatting to EXT4"));
    halt();
  }

  Serial.println(F("Micro SD card correctly partitioned"));
}

void createArduinoFolder() {
  Serial.print(F("\nCreating 'arduino' folder structure..."));
  Process folder;

  folder.runShellCommand(F("mkdir -p /mnt/sda1"));
  folder.runShellCommand(F("mount /dev/sda1 /mnt/sda1"));
  folder.runShellCommand(F("mkdir -p /mnt/sda1/arduino/www"));

  unmount();
}

void copySystemFilesFromYunToSD() {
  Serial.print(F("\nCopying files from Arduino Yun flash to micro SD card..."));
  Process copy;

  copy.runShellCommand(F("mkdir -p /mnt/sda2"));
  copy.runShellCommand(F("mount /dev/sda2 /mnt/sda2"));
  copy.runShellCommand(F("rsync -a --exclude=/mnt/ --exclude=/www/sd /overlay/ /mnt/sda2/"));

  unmount();
}

void unmount() {
  Process format;
  format.runShellCommand(F("umount /dev/sda?"));
  debugProcess(format);
  format.runShellCommand(F("rm -rf /mnt/sda?"));
  debugProcess(format);
}

void enableExtRoot() {
  Serial.print(F("\nEnabling micro SD as additional disk space... "));

  Process fstab;

  fstab.runShellCommand(F("uci add fstab mount"));
  fstab.runShellCommand(F("uci set fstab.@mount[0].target=/overlay"));
  fstab.runShellCommand(F("uci set fstab.@mount[0].device=/dev/sda2"));
  fstab.runShellCommand(F("uci set fstab.@mount[0].fstype=ext4"));
  fstab.runShellCommand(F("uci set fstab.@mount[0].enabled=1"));
  fstab.runShellCommand(F("uci set fstab.@mount[0].enabled_fsck=0"));
  fstab.runShellCommand(F("uci set fstab.@mount[0].options=rw,sync,noatime,nodiratime"));
  fstab.runShellCommand(F("uci commit"));

  Serial.println(F("enabled"));
}

