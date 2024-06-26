SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `account` (
  `id` varchar(20) NOT NULL,
  `ip` varchar(50) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `admin` (
  `id` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `afk` (
  `id` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `mention` int(10) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `announce` (
  `channel` varchar(20) NOT NULL,
  `server` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `bump` (
  `id` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `count` (
  `id` varchar(10) NOT NULL,
  `message` int(10) NOT NULL,
  `command` int(10) NOT NULL,
  `stock` int(10) NOT NULL,
  `buy` int(10) NOT NULL,
  `sell` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `dissoku` (
  `id` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `gift` (
  `id` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `user` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `global` (
  `channel` varchar(20) NOT NULL,
  `server` varchar(20) NOT NULL,
  `id` varchar(20) NOT NULL,
  `token` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `hiroyuki` (
  `channel` varchar(20) NOT NULL,
  `server` varchar(20) NOT NULL,
  `id` varchar(20) NOT NULL,
  `token` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `history` (
  `id` varchar(20) NOT NULL,
  `amount` int(20) NOT NULL,
  `reason` varchar(300) NOT NULL,
  `user` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ignore` (
  `id` varchar(20) NOT NULL,
  `bump` tinyint(1) NOT NULL DEFAULT 0,
  `dissoku` tinyint(1) NOT NULL DEFAULT 0,
  `up` tinyint(1) NOT NULL DEFAULT 0,
  `expand` tinyint(1) NOT NULL DEFAULT 0,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `join` (
  `server` varchar(20) NOT NULL,
  `channel` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `id` varchar(20) NOT NULL,
  `token` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `leave` (
  `server` varchar(20) NOT NULL,
  `channel` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `id` varchar(20) NOT NULL,
  `token` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `log` (
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ping` int(10) NOT NULL,
  `user` int(10) NOT NULL,
  `guild` int(10) NOT NULL,
  `message` int(10) NOT NULL,
  `command` int(10) NOT NULL,
  `cpu` varchar(100) NOT NULL,
  `ram` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `money` (
  `id` varchar(20) NOT NULL,
  `amount` int(10) NOT NULL,
  `yellow` int(10) NOT NULL,
  `red` int(10) NOT NULL,
  `blue` int(10) NOT NULL,
  `random` int(10) NOT NULL,
  `stock` int(10) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mute_ip` (
  `ip` varchar(50) NOT NULL,
  `reason` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mute_server` (
  `id` varchar(20) NOT NULL,
  `reason` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mute_user` (
  `id` varchar(20) NOT NULL,
  `reason` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pin` (
  `channel` varchar(20) NOT NULL,
  `server` varchar(20) NOT NULL,
  `message` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `report` (
  `id` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `target` varchar(20) NOT NULL,
  `title` varchar(300) NOT NULL,
  `reason` varchar(1000) NOT NULL,
  `reporter` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `server` (
  `id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `count` int(10) NOT NULL,
  `icon` varchar(300) NOT NULL,
  `owner` varchar(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `stats` (
  `id` varchar(20) NOT NULL,
  `message` int(10) NOT NULL,
  `react` int(10) NOT NULL,
  `join` int(10) NOT NULL,
  `leave` int(10) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `trade` (
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` int(10) NOT NULL,
  `buy` int(10) NOT NULL,
  `sell` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `up` (
  `id` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `afk`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `announce`
  ADD PRIMARY KEY (`channel`);

ALTER TABLE `bump`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `count`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `dissoku`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `gift`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `global`
  ADD PRIMARY KEY (`channel`);

ALTER TABLE `hiroyuki`
  ADD PRIMARY KEY (`channel`);

ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ignore`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `join`
  ADD PRIMARY KEY (`server`);

ALTER TABLE `leave`
  ADD PRIMARY KEY (`server`);

ALTER TABLE `log`
  ADD PRIMARY KEY (`time`);

ALTER TABLE `money`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `mute_ip`
  ADD PRIMARY KEY (`ip`);

ALTER TABLE `mute_server`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `mute_user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pin`
  ADD PRIMARY KEY (`channel`);

ALTER TABLE `report`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `server`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `stats`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `trade`
  ADD PRIMARY KEY (`time`);

ALTER TABLE `up`
  ADD PRIMARY KEY (`id`);