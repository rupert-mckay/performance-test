import { type ComponentType, forwardRef, useMemo, useState } from "react";

const FakePopover = ({ InnerComponent }: { InnerComponent: ComponentType }) => {
	return (
		<section style={{ margin: "1rem", padding: "1rem" }}>
			<p>I am FakePopover</p>
			<InnerComponent />
		</section>
	);
};

const createComponentWithWidth = (width: number) => {
	console.count("withoutmemoinner");
	const adjustedComponent = forwardRef<HTMLDivElement>((props, ref) => (
		<div
			style={{ width: `${width}px`, border: "1px solid black" }}
			{...props}
			ref={ref}
		>
			I am an adjusted inner component, constructed in a separate function. When
			I render I increment the withoutmemoinner counter.
		</div>
	));
	adjustedComponent.displayName = "ContentWithWidth";
	return adjustedComponent;
};

const FakeHintWithoutMemo = ({ width, x }: { width: number; x: number }) => {
	console.count("withoutmemo");
	return (
		<section
			style={{ border: "1px solid black", padding: "1rem", margin: "1rem" }}
		>
			<p>{`I am FakeHintWithoutMemo. When I render, I increment the withoutmemo counter. x is ${x}`}</p>
			<FakePopover InnerComponent={createComponentWithWidth(width)} />
		</section>
	);
};

const FakeHintWithMemo = ({ width, x }: { width: number; x: number }) => {
	console.count("withmemo");
	const InnerComponent = useMemo(() => {
		console.count("withmemoinner");
		const adjustedComponent = forwardRef<HTMLDivElement>((props, ref) => (
			<div
				style={{ width: `${width}px`, border: "1px solid black" }}
				{...props}
				ref={ref}
			>
				I am an adjusted inner component, constructed with a memo. When I am
				rendered I increment the withmemoinner counter.
			</div>
		));
		adjustedComponent.displayName = "ContentWithWidth";
		return adjustedComponent;
	}, [width]);

	return (
		<section
			style={{ border: "1px solid black", padding: "1rem", margin: "1rem" }}
		>
			<p>{`I am FakeHintWithMemo. When I render I increment the withmemo counter. x is ${x}`}</p>
			<FakePopover InnerComponent={InnerComponent} />
		</section>
	);
};

export const App = () => {
	const [width, setWidth] = useState(100);
	const [x, setX] = useState(0);
	return (
		<>
			<h1>Performance test</h1>
			<p>
				Source available at:{" "}
				<a href="https://github.com/rupert-mckay/performance-test">Github</a>
			</p>
			<p>
				The value of width should trigger a rerender all the way down the
				element tree. However changes in `x` should not affect the inner
				components. Review console output to see render counters increase as the
				buttons are clicked.
			</p>
			<button onClick={() => setWidth((w) => w + 10)}>Increase width</button>
			<button onClick={() => setX((i) => i + 1)}>Increase x</button>
			<h2>With Memo</h2>
			<FakeHintWithMemo width={width} x={x} />
			<h2>Without Memo</h2>
			<FakeHintWithoutMemo width={width} x={x} />
		</>
	);
};
