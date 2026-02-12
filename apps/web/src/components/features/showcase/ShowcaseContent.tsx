"use client";

import {
  Mail,
  Lock,
  User,
  Search,
  Heart,
  ShoppingCart,
  Star,
  Check,
} from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Component Content for Showcase Page
 * Demonstrates all Phase 2 UI components
 */
export function ShowcaseContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            UI Component Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Phase 2: Core UI Components - All Enhanced & Ready to Use
          </p>
        </div>

        <div className="space-y-16">
          {/* Buttons Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Buttons</h2>
            <Card padding="lg">
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="gradient">Gradient</Button>
                    <Button variant="gradient-gold">Gold</Button>
                    <Button variant="gradient-sunset">Sunset</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="gradient" leftIcon={ShoppingCart}>
                      Add to Cart
                    </Button>
                    <Button variant="gradient-gold" rightIcon={Star}>
                      Premium
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={Heart}
                      rightIcon={Check}
                    >
                      Save to Wishlist
                    </Button>
                    <Button isLoading>Loading...</Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Cards Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default" hover>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Standard card with border</CardDescription>
                </CardHeader>
                <CardContent>
                  This is a default card with hover effect.
                </CardContent>
              </Card>

              <Card variant="glass" shadow="xl">
                <CardHeader>
                  <CardTitle gradient>Glass Card</CardTitle>
                  <CardDescription>Glassmorphism effect</CardDescription>
                </CardHeader>
                <CardContent>Beautiful glass effect with blur.</CardContent>
              </Card>

              <Card variant="gradient-border" shadow="colored">
                <CardHeader>
                  <CardTitle>Gradient Border</CardTitle>
                  <CardDescription>Premium gradient border</CardDescription>
                </CardHeader>
                <CardContent>Card with gradient border effect.</CardContent>
              </Card>

              <Card variant="elevated" hover>
                <CardImage
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"
                  alt="Product"
                  aspectRatio="square"
                />
                <CardContent>
                  <CardTitle>Product Card</CardTitle>
                  <p className="text-2xl font-bold text-gradient mt-2">$299</p>
                </CardContent>
                <CardFooter>
                  <Button variant="gradient" fullWidth>
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Inputs Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Inputs</h2>
            <Card padding="lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={Mail}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  leftIcon={Lock}
                />

                <Input
                  label="Search Products"
                  placeholder="Search..."
                  leftIcon={Search}
                  rightIcon={<span className="text-xs text-gray-400">⌘K</span>}
                />

                <Input
                  label="Username"
                  error="Username is already taken"
                  leftIcon={User}
                />

                <Input label="Floating Label" floatingLabel leftIcon={Mail} />

                <Input
                  label="With Helper Text"
                  helperText="We'll never share your email"
                  leftIcon={Mail}
                />
              </div>
            </Card>
          </section>

          {/* Tabs Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Tabs</h2>
            <Card padding="lg">
              <Tabs defaultValue="overview">
                <TabsList variant="pills">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <p className="text-gray-600">
                    This is the overview tab content. Tabs support multiple
                    variants including default, pills, and underline styles.
                  </p>
                </TabsContent>

                <TabsContent value="specs">
                  <p className="text-gray-600">
                    Specifications content goes here. Each tab content animates
                    smoothly when switching.
                  </p>
                </TabsContent>

                <TabsContent value="reviews">
                  <p className="text-gray-600">
                    Customer reviews and ratings would be displayed here.
                  </p>
                </TabsContent>
              </Tabs>
            </Card>
          </section>

          {/* Accordion Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Accordion</h2>
            <Card padding="lg">
              <Accordion type="single" collapsible>
                <AccordionItem value="item1">
                  <AccordionTrigger>
                    What is your return policy?
                  </AccordionTrigger>
                  <AccordionContent>
                    We offer a 7-day free return policy on all products. Items
                    must be in original condition with tags attached.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item2">
                  <AccordionTrigger>
                    How long does shipping take?
                  </AccordionTrigger>
                  <AccordionContent>
                    Standard shipping takes 2-5 business days. Express shipping
                    is available for 1-2 day delivery.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item3">
                  <AccordionTrigger>
                    Do you ship internationally?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, we ship to over 50 countries worldwide. International
                    shipping rates vary by destination.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </section>

          {/* Avatar Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Avatars</h2>
            <Card padding="lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sizes</h3>
                  <div className="flex items-center gap-4">
                    <Avatar size="xs" fallback="XS" />
                    <Avatar size="sm" fallback="SM" />
                    <Avatar size="md" fallback="MD" />
                    <Avatar size="lg" fallback="LG" />
                    <Avatar size="xl" fallback="XL" />
                    <Avatar size="2xl" fallback="2XL" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">With Status</h3>
                  <div className="flex items-center gap-4">
                    <Avatar fallback="ON" status="online" />
                    <Avatar fallback="OF" status="offline" />
                    <Avatar fallback="AW" status="away" />
                    <Avatar fallback="BS" status="busy" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Avatar Group</h3>
                  <AvatarGroup max={4}>
                    <Avatar fallback="JD" />
                    <Avatar fallback="SM" />
                    <Avatar fallback="AL" />
                    <Avatar fallback="MK" />
                    <Avatar fallback="RP" />
                    <Avatar fallback="TW" />
                  </AvatarGroup>
                </div>
              </div>
            </Card>
          </section>

          {/* Switch Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Switches</h2>
            <Card padding="lg">
              <div className="space-y-4">
                <Switch
                  label="Enable notifications"
                  description="Receive email updates about your orders"
                />
                <Switch
                  label="Marketing emails"
                  description="Get the latest deals and offers"
                  size="sm"
                />
                <Switch
                  label="Two-factor authentication"
                  description="Add an extra layer of security"
                  size="lg"
                />
              </div>
            </Card>
          </section>

          {/* Tooltip Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Tooltips</h2>
            <Card padding="lg">
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Tooltip on top" side="top">
                  <Button>Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip on right" side="right">
                  <Button>Right</Button>
                </Tooltip>
                <Tooltip content="Tooltip on bottom" side="bottom">
                  <Button>Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip on left" side="left">
                  <Button>Left</Button>
                </Tooltip>
              </div>
            </Card>
          </section>

          {/* Combined Example */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Combined Example: Login Form
            </h2>
            <div className="max-w-md mx-auto">
              <Card variant="elevated" padding="xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      floatingLabel
                      leftIcon={Mail}
                      required
                    />
                    <Input
                      label="Password"
                      type="password"
                      floatingLabel
                      leftIcon={Lock}
                      required
                    />
                    <div className="flex items-center justify-between">
                      <Switch label="Remember me" size="sm" />
                      <a
                        href="#"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Button variant="gradient" fullWidth size="lg">
                      Sign In
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      Don&apos;t have an account?{" "}
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Sign up
                      </a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
