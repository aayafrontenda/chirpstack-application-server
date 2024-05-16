#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    create role chirpstack_as_events with login password 'dbpassword';
    create database chirpstack_as_events with owner chirpstack_as_events;
EOSQL
