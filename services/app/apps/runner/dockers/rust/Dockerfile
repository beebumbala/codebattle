FROM codebattle/runner-rs:latest AS runner

FROM rust:1.86.0-alpine3.21

RUN apk add --update --no-cache make libc-dev

WORKDIR /usr/src/app

ADD Cargo.toml .
RUN mkdir check && \
  echo "fn main() {}" > check/checker.rs && \
  cargo build

ADD Makefile .

EXPOSE 8000

COPY --from=runner /app/codebattle_runner /runner/codebattle_runner
